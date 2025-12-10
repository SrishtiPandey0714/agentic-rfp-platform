"""
technical_agent.py

Technical Agent Responsibilities:

1. Receive selected RFP JSON file path from Main Agent / Sales Agent.
2. Load:
   - RFP details (scope of supply)
   - Product specifications CSV (SKU database)

3. For each RFP line item:
   - Normalize RFP specifications
   - Compare against all product SKUs
   - Calculate "Spec Match %" for each product
   - Identify Top 3 closest-matching SKUs
   - Build a detailed comparison table
   - Choose the final recommended SKU

4. Return structured output to:
   - Main Agent (for consolidation)
   - Pricing Agent (for costing)

This file defines:
- Function structure
- Data flow
- Detailed comments explaining what each part will do
"""

import os

# Import loaders
from loaders.json_loader import (
    load_rfp_json,
    load_product_specs,
    normalize_rfp_specs,
    normalize_product_specs
)



# -----------------------------------------------------------
# STEP 1 — Load and Prepare Data
# -----------------------------------------------------------

def load_rfp_and_products(rfp_json_path: str, product_csv_path: str):
    """
    Loads:
        - RFP JSON
        - Product specs CSV
        - Normalizes both datasets

    Returns:
        (rfp_data, normalized_rfp_items, normalized_products)
    """

    # Load raw RFP document
    rfp_data = load_rfp_json(rfp_json_path)

    # Extract list of line items in scope of supply
    rfp_items = rfp_data.get("scope_of_supply", [])

    # Normalize specs for each RFP item
    normalized_rfp_items = [
        normalize_rfp_specs(item)
        for item in rfp_items
    ]

    # Load product SKU database
    products = load_product_specs(product_csv_path)

    # Normalize product specs for fair matching
    normalized_products = normalize_product_specs(products)

    return rfp_data, normalized_rfp_items, normalized_products



# -----------------------------------------------------------
# STEP 2 — Compare RFP Specs vs Product Specs
# -----------------------------------------------------------

def calculate_spec_match(rfp_item: dict, product: dict) -> float:
    """
    Calculates similarity between a single RFP item and one product SKU.

    Inputs:
        rfp_item (dict): normalized RFP specs
        product (dict): normalized product specs

    Output:
        float: percentage match (0-100)

    RULE:
        match_count / total_spec_attributes * 100

    This is a placeholder — logic will be implemented later.
    """

    # TODO: implement matching logic
    return 0.0



def rank_products_for_rfp_item(rfp_item: dict, product_list: list):
    """
    For ONE RFP line item:
        - Compares it against ALL products
        - Computes spec match %
        - Sorts them by highest match

    Returns:
        list of dicts:
            [
                {
                    "sku_id": "...",
                    "match_percent": 92.5,
                    "product_specs": {...}
                },
                ...
            ]
    """

    ranking = []

    for product in product_list:
        match_percent = calculate_spec_match(rfp_item, product)

        ranking.append({
            "sku_id": product.get("sku_id", "UNKNOWN"),
            "match_percent": match_percent,
            "product_specs": product
        })

    # Sort highest → lowest spec match %
    ranking = sorted(ranking, key=lambda x: x["match_percent"], reverse=True)

    return ranking



# -----------------------------------------------------------
# STEP 3 — Build Comparison Table for Top 3 SKUs
# -----------------------------------------------------------

def build_comparison_table(rfp_item: dict, top_products: list):
    """
    Creates a table comparing:
        - RFP spec values
        - Product spec values of top 3 SKUs

    Example return:

    {
        "parameters": ["cores", "size_sqmm", "insulation", "voltage"],
        "rfp_values": ["3", "2.5", "pvc", "1.1kv"],
        "sku_1": {...},
        "sku_2": {...},
        "sku_3": {...}
    }

    This helps Pricing Agent and Main Agent understand WHY a SKU was chosen.
    """

    # Placeholder structure
    table = {
        "rfp_specs": rfp_item,
        "top_3_skus": top_products[:3],
    }

    return table



# -----------------------------------------------------------
# STEP 4 — Select FINAL Recommended SKU
# -----------------------------------------------------------

def select_final_sku(top_products: list) -> str:
    """
    From the ranked SKUs, choose the best one.
    Currently: highest match_percent.

    Returns:
        sku_id (string)
    """

    if not top_products:
        return None

    return top_products[0]["sku_id"]



# -----------------------------------------------------------
# STEP 5 — Process ALL RFP Line Items
# -----------------------------------------------------------

def process_rfp_items(rfp_data: dict, normalized_rfp_items: list, normalized_products: list):
    """
    For each RFP item in scope of supply:
        - Rank product SKUs
        - Get top 3
        - Build comparison table
        - Select final recommended SKU

    Returns structured info for Main Agent + Pricing Agent:

    {
        "rfp_id": "RFP-001",
        "results": [
            {
                "item_index": 1,
                "rfp_specs": {...},
                "top_3_skus": [...],
                "comparison_table": {...},
                "final_sku": "SKU-001",
                "match_percent": 98.4
            }
        ]
    }
    """

    results = []

    for index, rfp_item in enumerate(normalized_rfp_items, start=1):

        # Rank all products
        ranked_products = rank_products_for_rfp_item(rfp_item, normalized_products)

        # Take top 3 SKUs
        top_3 = ranked_products[:3]

        # Build comparison table
        comparison_table = build_comparison_table(rfp_item, top_3)

        # Final recommended SKU
        final_sku_id = select_final_sku(top_3)

        results.append({
            "item_index": index,
            "rfp_specs": rfp_item,
            "top_3_skus": top_3,
            "comparison_table": comparison_table,
            "final_sku": final_sku_id,
            "match_percent": top_3[0]["match_percent"] if top_3 else 0
        })

    return {
        "rfp_id": rfp_data.get("rfp_id"),
        "items": results
    }



# -----------------------------------------------------------
# STEP 6 — ENTRY POINT for Technical Agent
# -----------------------------------------------------------

def run_technical_agent(rfp_json_path: str, product_csv_path: str):
    """
    Main function called by Main Agent.

    Steps:
        1. Load RFP JSON + product specs
        2. Normalize specs
        3. Process each RFP line item
        4. Return final table of recommended SKUs

    Output:
        {
            "rfp_id": "...",
            "items": [...],
        }
    """

    print("\n========== TECHNICAL AGENT STARTED ==========\n")

    # Load + normalize data
    rfp_data, normalized_rfp_items, normalized_products = load_rfp_and_products(
        rfp_json_path, product_csv_path
    )

    print(f"[Technical Agent] Loaded RFP: {rfp_data.get('rfp_id')}")
    print(f"[Technical Agent] Total RFP items: {len(normalized_rfp_items)}")
    print(f"[Technical Agent] Total products in DB: {len(normalized_products)}")

    # Process all RFP line items
    processed_output = process_rfp_items(
        rfp_data,
        normalized_rfp_items,
        normalized_products
    )

    print("\n========== TECHNICAL AGENT COMPLETED ==========\n")

    return processed_output



# -----------------------------------------------------------
# END OF MODULE
# -----------------------------------------------------------
