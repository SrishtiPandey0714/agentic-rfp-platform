"""
json_loader.py

This module is responsible for loading and normalizing:
1. RFP JSON documents (scope of supply + test requirements)
2. OEM product specification CSV (product_specs.csv)

The Technical Agent will call these functions to:
- Read RFP item-level requirements
- Read product SKUs and their technical attributes
"""

import os
import json
import csv



# -----------------------------------------------------------
# FUNCTION 1 — Load RFP JSON file
# -----------------------------------------------------------

def load_rfp_json(file_path: str) -> dict:
    """
    Loads the JSON RFP document from backend/data/rfp_documents/

    Args:
        file_path (str): Path to the JSON file.

    Returns:
        dict: Parsed JSON structure with keys like:
              {
                "rfp_id": "...",
                "issuer": "...",
                "due_date": "...",
                "scope_of_supply": [ ... ],
                "testing_requirements": [ ... ]
              }
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"RFP JSON file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data



# -----------------------------------------------------------
# FUNCTION 2 — Load Product Specs from CSV
# -----------------------------------------------------------

def load_product_specs(csv_path: str) -> list:
    """
    Loads product_specs.csv and returns it as a list of dictionaries.

    Example return:
    [
        {
            "sku_id": "SKU-001",
            "brand": "Finolex",
            "category": "LT Cables",
            "cores": "3",
            "size_sqmm": "2.5",
            "voltage": "1.1kV",
            "insulation": "PVC",
            "conductor": "Copper",
            "standard": "IS 694",
            "remarks": "Domestic wiring"
        },
        ...
    ]

    Args:
        csv_path (str): File path to product_specs.csv

    Returns:
        list[dict]: Product records
    """

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Product specs CSV not found: {csv_path}")

    product_list = []

    with open(csv_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            # Convert all values to stripped lowercase versions
            normalized_row = {key: value.strip() for key, value in row.items()}

            product_list.append(normalized_row)

    return product_list



# -----------------------------------------------------------
# HELPER 3 — Normalize RFP Specification Values
# -----------------------------------------------------------

def normalize_rfp_specs(rfp_specs: dict) -> dict:
    """
    Takes raw RFP spec parameters and normalizes text for fair matching.

    Example input:
        {
          "cores": "3 Core",
          "size_sqmm": "2.5 sqmm",
          "voltage": "1.1 KV",
          "insulation": "PVC Insulated",
          "conductor": "COPPER",
          "standard": "IS-694"
        }

    Example normalized output:
        {
          "cores": "3",
          "size_sqmm": "2.5",
          "voltage": "1.1kv",
          "insulation": "pvc",
          "conductor": "copper",
          "standard": "is 694"
        }

    Args:
        rfp_specs (dict): Raw spec dictionary from RFP JSON

    Returns:
        dict: Normalized spec dictionary
    """

    normalized = {}

    for key, value in rfp_specs.items():

        if value is None:
            normalized[key] = ""
            continue

        v = value.lower().replace(" ", "").replace("-", "")

        # Specific cleaning rules
        if key == "cores":
            v = v.replace("core", "")
        if key == "size_sqmm":
            v = v.replace("sqmm", "")
        if key == "voltage":
            v = v.replace("kv", "") + "kv"  # ensure format like "1.1kv"
        if key == "insulation":
            v = v.replace("insulated", "")
        if key == "standard":
            v = v.replace("is", "is ")

        # Final trim
        normalized[key] = v.strip()

    return normalized



# -----------------------------------------------------------
# HELPER 4 — Normalize Product Specs (SKU Database)
# -----------------------------------------------------------

def normalize_product_specs(product_list: list) -> list:
    """
    Normalize product specs in CSV for consistent comparison.

    Example:
    - "PVC" → "pvc"
    - "IS-694" → "is 694"
    - "3 Core" → "3"

    Args:
        product_list (list): List of dictionaries from CSV

    Returns:
        list: Normalized SKU list
    """

    normalized_products = []

    for product in product_list:
        normalized = {}

        for key, value in product.items():

            if value is None:
                normalized[key] = ""
                continue

            v = value.lower().replace(" ", "").replace("-", "")

            # Clean specific fields
            if key == "cores":
                v = v.replace("core", "")
            if key == "size_sqmm":
                v = v.replace("sqmm", "")
            if key == "voltage":
                v = v.replace("kv", "") + "kv"
            if key == "insulation":
                v = v.replace("insulated", "")
            if key == "standard":
                v = v.replace("is", "is ")

            normalized[key] = v.strip()

        normalized_products.append(normalized)

    return normalized_products



# -----------------------------------------------------------
# END OF MODULE
# -----------------------------------------------------------