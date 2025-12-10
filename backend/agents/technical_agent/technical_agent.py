"""
technical_agent.py

Full implementation of the Technical Agent.

Responsibilities:
- Load RFP JSON (one RFP selected by Sales Agent / Main Agent)
- Load product specs CSV (SKU database)
- Normalize fields and map keys to a common schema
- For every line-item in the RFP ("scope_of_supply"):
    - Compute a spec-match % against every SKU
    - Rank SKUs by match %
    - Pick top-3 SKUs and build a comparison table
    - Select the final recommended SKU (top match)
- Return a structured result consumable by:
    - Main Agent (for final consolidation)
    - Pricing Agent (for costing)

Assumptions:
- json_loader.py exists and implements:
    - load_rfp_json(path)
    - load_product_specs(csv_path)
    - normalize_rfp_specs(dict)
    - normalize_product_specs(list_of_dicts)
  (These return Python native structures.)
"""

import os
from typing import List, Dict, Any
from datetime import datetime

# Import loader functions (from your backend/loaders/json_loader.py)
from backend.loaders.json_loader import (
    load_rfp_json,
    load_product_specs,
    normalize_rfp_specs,
    normalize_product_specs,
)


# -------------------------
# Utility / Helper Functions
# -------------------------

def map_rfp_item_keys(raw_item: dict) -> dict:
    """
    Map raw RFP item keys into the canonical key set expected by the normalization
    and matching logic.

    Canonical keys used downstream:
      - cores (string / number)
      - size_sqmm (string/numeric)
      - voltage (string like '1.1kv')
      - insulation (string)
      - conductor (string)
      - standard (string)
      - quantity (int)
      - item_no, description (pass-through)

    This function detects common variants (like 'voltage_rating_kv') and produces
    a dictionary with expected keys.
    """

    mapped = {}

    # pass-through fields (if present)
    mapped["item_no"] = raw_item.get("item_no", raw_item.get("item", None))
    mapped["description"] = raw_item.get("description", "")

    # cores
    if "cores" in raw_item:
        mapped["cores"] = str(raw_item.get("cores"))
    elif "core" in raw_item:
        mapped["cores"] = str(raw_item.get("core"))
    else:
        mapped["cores"] = str(raw_item.get("no_of_cores", "")).strip()

    # size (multiple possible field names in RFPs)
    if "size_sqmm" in raw_item:
        mapped["size_sqmm"] = str(raw_item.get("size_sqmm"))
    elif "size" in raw_item:
        mapped["size_sqmm"] = str(raw_item.get("size"))
    else:
        mapped["size_sqmm"] = str(raw_item.get("conductor_size", "")).strip()

    # voltage (could be named voltage_rating_kv, voltage_kv, etc.)
    if "voltage" in raw_item:
        mapped["voltage"] = str(raw_item.get("voltage"))
    elif "voltage_rating_kv" in raw_item:
        mapped["voltage"] = str(raw_item.get("voltage_rating_kv"))
    elif "voltage_kv" in raw_item:
        mapped["voltage"] = str(raw_item.get("voltage_kv"))
    else:
        # fallback: try to parse from description if needed (not implemented here)
        mapped["voltage"] = str(raw_item.get("voltage", "")).strip()

    # insulation, conductor, standard
    mapped["insulation"] = str(raw_item.get("insulation", "")).strip()
    mapped["conductor"] = str(raw_item.get("conductor", "")).strip()

    # In some JSONs standard may be 'standard' or similar
    mapped["standard"] = str(raw_item.get("standard", raw_item.get("spec", ""))).strip()

    # quantity (numeric)
    try:
        mapped["quantity"] = int(raw_item.get("quantity", 0))
    except Exception:
        try:
            mapped["quantity"] = int(float(raw_item.get("quantity", 0)))
        except Exception:
            mapped["quantity"] = 0

    return mapped


def map_product_row_to_canonical(product_row: dict) -> dict:
    """
    The CSV product rows might have headers such as:
        sku, cores, size_sqmm, voltage_kv, insulation, conductor, standard

    We map them into canonical keys expected by the match algorithm:
        sku_id, cores, size_sqmm, voltage, insulation, conductor, standard
    """

    mapped = {}

    # SKU id
    mapped["sku_id"] = product_row.get("sku") or product_row.get("sku_id") or product_row.get("SKU") or ""

    # cores
    mapped["cores"] = str(product_row.get("cores", "")).strip()

    # size
    # CSV uses 'size_sqmm', keep same key
    mapped["size_sqmm"] = str(product_row.get("size_sqmm", product_row.get("size", ""))).strip()

    # voltage: CSV header earlier was 'voltage_kv' -> map to 'voltage'
    if "voltage_kv" in product_row:
        mapped["voltage"] = str(product_row.get("voltage_kv", "")).strip()
    else:
        # fallback to any 'voltage' key
        mapped["voltage"] = str(product_row.get("voltage", "")).strip()

    # insulation, conductor, standard
    mapped["insulation"] = str(product_row.get("insulation", "")).strip()
    mapped["conductor"] = str(product_row.get("conductor", "")).strip()
    mapped["standard"] = str(product_row.get("standard", "")).strip()

    # keep original full row for reference (prices etc. may be read separately)
    mapped["_raw"] = product_row

    return mapped


# -------------------------
# Spec Match Implementation
# -------------------------

def calculate_spec_match(rfp_item: dict, product: dict) -> float:
    """
    Calculates similarity between a normalized RFP item and a normalized product SKU.

    Rules:
    - Compare the following attributes with equal weight:
        cores, size_sqmm, voltage, insulation, conductor, standard
    - Numeric comparison tolerance for size_sqmm: ±0.2
    - cores match by integer equality
    - string fields are compared after normalization (lower stripping)
    - returns a percent (0..100) rounded to 2 decimals
    """

    attributes = ["cores", "size_sqmm", "voltage", "insulation", "conductor", "standard"]
    total_attributes = len(attributes)
    match_count = 0

    # helper to normalize strings for equality checks
    def norm_str(v):
        if v is None:
            return ""
        return str(v).lower().strip().replace(" ", "").replace("-", "")

    for attr in attributes:
        rfp_val = rfp_item.get(attr, "")
        prod_val = product.get(attr, "")

        # SIZE comparison (numeric, allow tolerance)
        if attr == "size_sqmm":
            try:
                rfp_size = float(str(rfp_val))
                prod_size = float(str(prod_val))
                if abs(rfp_size - prod_size) <= 0.2:
                    match_count += 1
            except Exception:
                # fallback to string compare
                if norm_str(rfp_val) and norm_str(rfp_val) == norm_str(prod_val):
                    match_count += 1

        # CORES comparison (integer)
        elif attr == "cores":
            try:
                if int(float(rfp_val)) == int(float(prod_val)):
                    match_count += 1
            except Exception:
                if norm_str(rfp_val) and norm_str(rfp_val) == norm_str(prod_val):
                    match_count += 1

        # STRING fields (voltage, insulation, conductor, standard)
        else:
            # Voltage may be like '1.1kv' or '1.1' — normalize to '1.1kv'
            if attr == "voltage":
                rv = str(rfp_val).lower().replace(" ", "")
                pv = str(prod_val).lower().replace(" ", "")
                # ensure 'kv' suffix
                if rv and "kv" not in rv:
                    rv = rv + "kv"
                if pv and "kv" not in pv:
                    pv = pv + "kv"
                if rv == pv and rv != "":
                    match_count += 1
            else:
                if norm_str(rfp_val) == norm_str(prod_val) and norm_str(rfp_val) != "":
                    match_count += 1

    match_percent = (match_count / total_attributes) * 100 if total_attributes else 0.0
    return round(match_percent, 2)


# -------------------------
# Ranking and Comparison
# -------------------------

def rank_products_for_rfp_item(rfp_item: dict, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Compute the match % for each product and return a sorted list (high -> low).
    Each entry returned contains:
      {
        "sku_id": ...,
        "match_percent": ...,
        "product": { ... }  # the canonical product record
      }
    """

    ranking = []
    for prod in products:
        match = calculate_spec_match(rfp_item, prod)
        ranking.append({
            "sku_id": prod.get("sku_id", prod.get("sku", "UNKNOWN")),
            "match_percent": match,
            "product": prod
        })

    # sort descending by match_percent
    ranking_sorted = sorted(ranking, key=lambda x: x["match_percent"], reverse=True)
    return ranking_sorted


def build_comparison_table(rfp_item: dict, top_products: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Build a simple comparison table structure for top products vs rfp_item.

    Output structure:
    {
      "parameters": ["cores", "size_sqmm", "voltage", "insulation", "conductor", "standard"],
      "rfp_values": { "cores": "...", ... },
      "skus": [
          {"sku_id": "...", "values": {"cores": "...", ...}, "match_percent": 95.0},
          ...
      ]
    }
    """

    parameters = ["cores", "size_sqmm", "voltage", "insulation", "conductor", "standard"]
    rfp_values = {p: rfp_item.get(p, "") for p in parameters}

    skus = []
    for entry in top_products:
        sku_id = entry.get("sku_id")
        prod = entry.get("product", {})
        values = {p: prod.get(p, "") for p in parameters}
        skus.append({
            "sku_id": sku_id,
            "values": values,
            "match_percent": entry.get("match_percent", 0.0)
        })

    table = {
        "parameters": parameters,
        "rfp_values": rfp_values,
        "skus": skus
    }
    return table


# -------------------------
# Main processing flow
# -------------------------

def process_rfp(rfp_json_path: str, product_csv_path: str) -> Dict[str, Any]:
    """
    Full processing pipeline for one RFP JSON file.

    Steps:
    1. load RFP JSON
    2. extract line items (scope_of_supply)
    3. map and normalize RFP items to canonical keys
    4. load product CSV and map/normalize to canonical keys
    5. for each RFP item:
        - rank all products
        - select top 3
        - build comparison table
        - pick final sku
    6. return structured output
    """

    if not os.path.exists(rfp_json_path):
        raise FileNotFoundError(f"RFP JSON file not found: {rfp_json_path}")

    if not os.path.exists(product_csv_path):
        raise FileNotFoundError(f"Product CSV file not found: {product_csv_path}")

    # 1. Load RFP JSON
    rfp_data = load_rfp_json(rfp_json_path)
    scope_items_raw = rfp_data.get("scope_of_supply", [])

    # 2. Map raw RFP items into canonical form and normalize
    rfp_mapped_items = [map_rfp_item_keys(item) for item in scope_items_raw]
    # Use normalize_rfp_specs from loader (which does text cleanup)
    normalized_rfp_items = [normalize_rfp_specs(item) for item in rfp_mapped_items]

    # 3. Load product CSV rows
    products_raw = load_product_specs(product_csv_path)  # returns list of dict rows
    # Map and canonicalize product rows
    products_mapped = [map_product_row_to_canonical(row) for row in products_raw]
    # Normalize product specs using the loader-normalizer (lowercase/strip rules)
    normalized_products = normalize_product_specs(products_mapped)

    # 4. Process each RFP item
    results = []
    for index, rfp_item in enumerate(normalized_rfp_items, start=1):
        # Rank products
        ranked = rank_products_for_rfp_item(rfp_item, normalized_products)

        # Top 3
        top_3 = ranked[:3]

        # Comparison table
        comparison_table = build_comparison_table(rfp_item, top_3)

        # final sku - take highest match_percent (first in ranked list)
        final_sku = top_3[0]["sku_id"] if len(top_3) > 0 else None
        final_match_percent = top_3[0]["match_percent"] if len(top_3) > 0 else 0.0

        results.append({
            "item_index": index,
            "description": rfp_item.get("description", ""),
            "rfp_specs": rfp_item,
            "top_3": top_3,
            "comparison_table": comparison_table,
            "final_recommended_sku": final_sku,
            "final_match_percent": final_match_percent,
            "quantity": rfp_item.get("quantity", 0)
        })

    # 5. Build final output
    output = {
        "rfp_id": rfp_data.get("rfp_id", "UNKNOWN"),
        "issuer": rfp_data.get("issuer"),
        "title": rfp_data.get("title"),
        "items": results
    }

    return output


# -------------------------
# Convenient entry point
# -------------------------

def run_technical_agent(rfp_json_path: str, product_csv_path: str) -> Dict[str, Any]:
    """
    Top-level entrypoint for external callers (Main Agent / API).
    Prints logs and returns structured data.
    """

    print("\n========== TECHNICAL AGENT START ==========")
    print(f"[Technical Agent] RFP JSON: {rfp_json_path}")
    print(f"[Technical Agent] Product CSV: {product_csv_path}")

    processed = process_rfp(rfp_json_path, product_csv_path)

    print("[Technical Agent] Processing complete.")
    print(f"[Technical Agent] RFP id: {processed.get('rfp_id')}")
    print(f"[Technical Agent] Items processed: {len(processed.get('items', []))}")
    print("========== TECHNICAL AGENT END ==========\n")

    return processed


# If you want to run quick local test:
if __name__ == "__main__":
    # example local test paths (adjust to your repo)
    example_rfp = "backend/data/rfp_documents/rfp_001.json"
    example_csv = "backend/data/datasets/product_specs.csv"

    if os.path.exists(example_rfp) and os.path.exists(example_csv):
        res = run_technical_agent(example_rfp, example_csv)
        import json
        print(json.dumps(res, indent=2))
    else:
        print("Example files not found. Please verify paths.") 