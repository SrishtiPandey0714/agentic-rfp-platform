"""
main_agent.py

Central Orchestrator Agent.

Pipeline Responsibilities:
--------------------------
1. Run Sales Agent → identify & select best RFP.
2. Load the selected RFP JSON document.
3. Run Technical Agent → compute SKU matches & spec comparisons.
4. Run Pricing Agent → compute full costing.
5. Merge results into a unified RFP response.
6. Save final output JSON under backend/data/output/.

This file coordinates the full multi-agent workflow.
"""

import os
import sys
import json

# -----------------------------------------------------------
# FIX PYTHON PATH (ROOT PROJECT)
# -----------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(BASE_DIR)

# -----------------------------------------------------------
# IMPORT AGENTS
# -----------------------------------------------------------
from agents.sales_agent.sales_agent import run_sales_agent
from agents.technical_agent.technical_agent import run_technical_agent
from agents.pricing_agent.pricing_agent import run_pricing_agent

# Loader for RFP JSON
from loaders.json_loader import load_rfp_json



# =====================================================================
# MAIN AGENT PIPELINE
# =====================================================================

def run_main_agent():
    print("\n==================== MAIN AGENT START ====================\n")

    # -------------------------------------------------------
    # STEP 1 — SALES AGENT
    # -------------------------------------------------------
    print("[Main Agent] Running Sales Agent...")
    sales_result = run_sales_agent()

    selected_rfp = sales_result.get("selected_rfp")

    if not selected_rfp:
        print("❌ No eligible RFP found — stopping Main Agent.")
        return None

    rfp_json_path = selected_rfp["rfp_link"]

    print(f"[Main Agent] Selected RFP → {selected_rfp['title']}")
    print(f"[Main Agent] RFP JSON Path → {rfp_json_path}")


    # -------------------------------------------------------
    # STEP 2 — LOAD RFP JSON
    # -------------------------------------------------------
    rfp_json = load_rfp_json(rfp_json_path)
    print("[Main Agent] RFP JSON loaded successfully.")


    # -------------------------------------------------------
    # STEP 3 — TECHNICAL AGENT
    # -------------------------------------------------------
    print("\n[Main Agent] Running Technical Agent...")

    product_csv_path = "backend/data/datasets/product_specs.csv"

    technical_output = run_technical_agent(
        rfp_json_path,
        product_csv_path
    )

    print("[Main Agent] Technical Agent completed.")


    # Save technical output
    os.makedirs("backend/data/tmp", exist_ok=True)
    technical_tmp_path = "backend/data/tmp/technical_output.json"

    with open(technical_tmp_path, "w") as f:
        json.dump(technical_output, f, indent=2)

    print(f"[Main Agent] Technical output saved → {technical_tmp_path}")


    # -------------------------------------------------------
    # STEP 4 — PRICING AGENT
    # -------------------------------------------------------
    print("\n[Main Agent] Running Pricing Agent...")

    pricing_output = run_pricing_agent(
        technical_output,
        rfp_json_path  # MUST pass path, not JSON object
    )

    print("[Main Agent] Pricing Agent completed.")


    # -------------------------------------------------------
    # STEP 5 — MERGE OUTPUTS
    # -------------------------------------------------------
    print("\n[Main Agent] Creating final consolidated RFP response...")

    final_response = {
        "rfp_id": rfp_json["rfp_id"],
        "title": rfp_json["title"],
        "issuer": rfp_json["issuer"],
        "due_date": rfp_json["due_date"],

        "technical_analysis": technical_output,
        "pricing_analysis": pricing_output,

        "summary": {
            "total_material_cost": pricing_output["totals"]["material_total"],
            "total_test_cost": pricing_output["totals"]["test_total"],
            "grand_total_cost": pricing_output["totals"]["grand_total"],
        }
    }


    # -------------------------------------------------------
    # STEP 6 — SAVE FINAL OUTPUT JSON
    # -------------------------------------------------------
    os.makedirs("backend/data/output", exist_ok=True)
    final_output_path = "backend/data/output/final_rfp_response.json"

    with open(final_output_path, "w") as f:
        json.dump(final_response, f, indent=2)

    print(f"[Main Agent] Final RFP Response saved → {final_output_path}")
    print("\n==================== MAIN AGENT END ====================\n")

    return final_response



# =====================================================================
# DIRECT SCRIPT EXECUTION (TEST MODE)
# =====================================================================

if __name__ == "__main__":
    print("\n========== MAIN AGENT TEST START ==========\n")

    # STEP 1 — SALES AGENT
    sales_output = run_sales_agent()
    selected_rfp = sales_output.get("selected_rfp")

    if not selected_rfp:
        print("❌ No eligible RFP found. Exiting.")
        exit()

    rfp_json_path = selected_rfp["rfp_link"]
    print(f"[Main Agent Test] Selected RFP JSON → {rfp_json_path}")


    # STEP 2 — TECHNICAL AGENT
    product_csv = "backend/data/datasets/product_specs.csv"
    technical_output = run_technical_agent(rfp_json_path, product_csv)

    # Save tech output
    tmp_path = "backend/data/tmp/technical_output.json"
    os.makedirs("backend/data/tmp", exist_ok=True)
    with open(tmp_path, "w") as f:
        json.dump(technical_output, f, indent=2)

    print(f"[Main Agent Test] Technical output saved → {tmp_path}")


    # STEP 3 — PRICING AGENT
    pricing_output = run_pricing_agent(technical_output, rfp_json_path)


    # STEP 4 — SAVE FINAL RESPONSE
    final_path = "backend/data/output/final_rfp_response.json"
    os.makedirs("backend/data/output", exist_ok=True)

    with open(final_path, "w") as f:
        json.dump(pricing_output, f, indent=2)

    print(f"[Main Agent Test] FINAL RESPONSE SAVED → {final_path}")
    print("\n========== MAIN AGENT TEST END ==========\n")
