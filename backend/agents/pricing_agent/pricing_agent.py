"""
pricing_agent.py

This module implements the FULL Pricing Agent workflow.

Responsibilities:
--------------------------------
1. Load product and test pricing tables.
2. Receive:
    - Technical Agent output (final SKUs + quantities)
    - RFP JSON (tests required)
3. For each line item:
    - Find SKU unit price
    - Multiply by quantity → material cost
    - Sum test costs → testing cost
    - Compute total cost per item
4. Compute:
    - total material cost
    - total test cost
    - grand total
5. Produce structured JSON output for Main Agent.
"""
import sys
import os

# Add backend folder to Python path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(BASE_DIR)


from loaders.pricing_loader import (
    load_product_prices,
    load_test_prices,
    normalize_key
)


# -----------------------------------------------------------
# Utility: Safely load JSON RFP file
# -----------------------------------------------------------

def load_rfp_json(json_path: str) -> dict:
    """Loads an RFP JSON file and returns it as a dictionary."""
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"RFP JSON not found: {json_path}")

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)



# -----------------------------------------------------------
# Pricing Logic for each item
# -----------------------------------------------------------

def compute_item_pricing(item: dict, product_prices: dict, test_prices: dict, tests_required: list) -> dict:
    """
    Computes total pricing for a SINGLE RFP line item.

    item structure (from Technical Agent):
        {
          "item_index": 1,
          "final_recommended_sku": "...",
          "final_match_percent": 100.0,
          "quantity": "500"
        }
    """

    sku = item["final_recommended_sku"]
    quantity = int(item["quantity"])

    sku_key = normalize_key(sku)

    # ------------------------------
    # 1. Material Cost
    # ------------------------------
    if sku_key not in product_prices:
        raise KeyError(f"SKU missing in product pricing: {sku}")

    unit_price = product_prices[sku_key]
    material_cost = unit_price * quantity

    # ------------------------------
    # 2. Test Cost
    # ------------------------------
    test_cost_total = 0
    used_tests = []

    for test in tests_required:
        test_key = normalize_key(test)

        if test_key not in test_prices:
            print(f"[WARNING] Test not found in pricing table: {test}")
            continue

        cost = test_prices[test_key]
        used_tests.append({ "test_name": test, "test_price": cost })
        test_cost_total += cost

    # ------------------------------
    # 3. Total Cost for item
    # ------------------------------
    total_cost = material_cost + test_cost_total

    return {
        "item_no": item["item_index"],
        "sku": sku,
        "match_percent": item["final_match_percent"],
        "quantity": quantity,
        "unit_price": unit_price,
        "material_cost": material_cost,
        "tests": used_tests,
        "test_cost_total": test_cost_total,
        "total_cost": total_cost
    }



# -----------------------------------------------------------
# MAIN PRICING AGENT WORKFLOW
# -----------------------------------------------------------

def run_pricing_agent(technical_output: dict, rfp_json_path: str) -> dict:
    """
    Executes the full pricing agent pipeline.

    Inputs:
        technical_output -> Full output JSON from Technical Agent
        rfp_json_path    -> Path to the RFP JSON file

    Returns:
        Final structured pricing summary
    """

    print("\n========== PRICING AGENT START ==========\n")

    # -------------------------------------------------------
    # Load RFP JSON (tests required)
    # -------------------------------------------------------
    rfp_data = load_rfp_json(rfp_json_path)
    tests_required = rfp_data.get("tests_required", [])
    print(f"[Pricing Agent] Loaded {len(tests_required)} test types.")

    # -------------------------------------------------------
    # Load price tables
    # -------------------------------------------------------
    product_csv = "backend/data/datasets/product_pricing.csv"
    test_csv = "backend/data/datasets/test_pricing.csv"

    product_prices = load_product_prices(product_csv)
    test_prices = load_test_prices(test_csv)

    print(f"[Pricing Agent] Loaded {len(product_prices)} product prices.")
    print(f"[Pricing Agent] Loaded {len(test_prices)} test prices.")

    # -------------------------------------------------------
    # Read items from Technical Agent output
    # -------------------------------------------------------
    rfp_items = technical_output.get("items", [])
    print(f"[Pricing Agent] Received {len(rfp_items)} line items from Technical Agent.")

    # -------------------------------------------------------
    # Compute pricing for each item
    # -------------------------------------------------------
    priced_items = []
    total_material = 0
    total_test_cost = 0

    for item in rfp_items:
        pricing = compute_item_pricing(
            item=item,
            product_prices=product_prices,
            test_prices=test_prices,
            tests_required=tests_required
        )

        priced_items.append(pricing)
        total_material += pricing["material_cost"]
        total_test_cost += pricing["test_cost_total"]

    grand_total = total_material + total_test_cost

    print(f"[Pricing Agent] Material Total = {total_material}")
    print(f"[Pricing Agent] Test Total = {total_test_cost}")
    print(f"[Pricing Agent] Grand Total = {grand_total}")

    print("\n========== PRICING AGENT END ==========\n")

    # -------------------------------------------------------
    # FINAL OUTPUT STRUCTURE
    # -------------------------------------------------------
    return {
        "rfp_id": rfp_data.get("rfp_id"),
        "title": rfp_data.get("title"),
        "issuer": rfp_data.get("issuer"),
        "pricing_summary": priced_items,
        "totals": {
            "material_total": total_material,
            "test_total": total_test_cost,
            "grand_total": grand_total
        }
    }



# -----------------------------------------------------------
# Optional: Standalone test runner
# -----------------------------------------------------------

if __name__ == "__main__":

    # Example paths — update as needed
    example_rfp_json = "backend/data/rfp_documents/rfp_001.json"
    example_technical_output_path = "backend/data/tmp/technical_output.json"

    # Load technical output JSON
    with open(example_technical_output_path, "r") as f:
        technical_output = json.load(f)

    result = run_pricing_agent(technical_output, example_rfp_json)

    print(json.dumps(result, indent=2))
