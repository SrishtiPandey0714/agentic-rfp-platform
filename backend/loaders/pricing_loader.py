"""
pricing_loader.py

This module loads and processes:
1. Product pricing table (product_pricing.csv)
2. Test pricing table (test_pricing.csv)

The Pricing Agent uses these mappings to determine:
- Unit price per SKU
- Cost per test type

Both CSVs are converted into Python dictionaries for fast lookup.
"""

import os
import csv



# -----------------------------------------------------------
# Utility: Normalize text keys (so comparisons are safe)
# -----------------------------------------------------------

def normalize_key(value: str) -> str:
    """
    Converts any text key into a uniform format:
    - lowercase
    - no extra spaces
    - removes hyphens

    Example:
        'High Voltage Test' → 'highvoltagetest'
        'CABLE-PVC-3C-2.5-IS694' → 'cablepvc3c2.5is694'
    """
    if value is None:
        return ""

    return (
        str(value)
        .lower()
        .strip()
        .replace(" ", "")
        .replace("-", "")
    )



# -----------------------------------------------------------
# 1️⃣ Load Product Pricing CSV
# -----------------------------------------------------------

def load_product_prices(csv_path: str) -> dict:
    """
    Loads product_pricing.csv and converts it into a dictionary:

    CSV format:
        sku_id, unit_price

    Returns:
        {
          "cablepvc3c2.5is694": 85.0,
          "cablepvc3c4is694": 120.0,
          ...
        }
    """

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Product pricing file missing: {csv_path}")

    price_map = {}

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            raw_sku = row.get("sku_id")
            raw_price = row.get("unit_price")

            if not raw_sku:
                continue  # skip rows with missing SKU

            key = normalize_key(raw_sku)

            try:
                price_map[key] = float(raw_price)
            except Exception:
                raise ValueError(f"Invalid price for SKU '{raw_sku}' in CSV.")

    return price_map



# -----------------------------------------------------------
# 2️⃣ Load Test Pricing CSV
# -----------------------------------------------------------

def load_test_prices(csv_path: str) -> dict:
    """
    Loads test_pricing.csv and converts it into a dictionary:

    CSV format:
        test_name, test_price

    Returns:
        {
          "conductorresistancetest": 50.0,
          "insulationresistancetest": 75.0,
          "highvoltagetest": 100.0,
          ...
        }
    """

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Test pricing file missing: {csv_path}")

    test_map = {}

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            raw_name = row.get("test_name")
            raw_price = row.get("test_price")

            if not raw_name:
                continue

            key = normalize_key(raw_name)

            try:
                test_map[key] = float(raw_price)
            except Exception:
                raise ValueError(f"Invalid price for test '{raw_name}' in CSV.")

    return test_map



# -----------------------------------------------------------
# END OF MODULE
# -----------------------------------------------------------
