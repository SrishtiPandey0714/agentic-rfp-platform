"""
main_agent.py

The Main Orchestrator Agent.

Responsibilities:
-----------------
1. Trigger the Sales Agent to discover and select an RFP.
2. Load the selected RFP JSON for downstream processing.
3. Send RFP technical scope to the Technical Agent.
4. Send test/acceptance requirements + SKU recommendations to Pricing Agent.
5. Merge outputs from all agents into a final unified RFP response.
6. Save final output to backend/data/output/.

This is the core pipeline that simulates the real B2B RFP response workflow.
"""

import os
import json

# ----------------------------
# Import Sales, Technical, Pricing Agents
# ----------------------------
from backend.agents.sales_agent.sales_agent import run_sales_agent
from backend.agents.technical_agent.technical_agent import run_technical_agent
from backend.agents.pricing_agent.pricing_agent import run_pricing_agent

# Loader to read RFP JSON
from backend.loaders.json_loader import load_rfp_json






# -----------------------------------------------------------
# MAIN PIPELINE FUNCTION
# -----------------------------------------------------------

def run_main_agent():
    print("\n==================== MAIN AGENT START ====================\n")

    # -------------------------------------------------------
    # STEP 1 — Run Sales Agent
    # -------------------------------------------------------
    print("[Main Agent] Running Sales Agent...")
    sales_result = run_sales_agent()

    selected_rfp = sales_result["selected_rfp"]

    if not selected_rfp:
        print("❌ No eligible RFP found. Main Agent stopping.")
        return None

    print(f"[Main Agent] Selected RFP: {selected_rfp['title']}")
    print(f"[Main Agent] RFP Document Path: {selected_rfp['rfp_link']}")



    # -------------------------------------------------------
    # STEP 2 — Load RFP JSON Document
    # -------------------------------------------------------
    rfp_json_path = selected_rfp["rfp_link"]

    rfp_json = load_rfp_json(rfp_json_path)
    print("[Main Agent] Loaded RFP JSON successfully.")



    # -------------------------------------------------------
    # STEP 3 — Run Technical Agent
    # -------------------------------------------------------
    

    p# ----------------------------
# RUN TECHNICAL AGENT
# ----------------------------
    print("\n[Main Agent] Running Technical Agent...")

    product_csv_path = "backend/data/datasets/product_specs.csv"  # REQUIRED

    technical_output = run_technical_agent(
    rfp_json_path,
    product_csv_path
    )

    print("[Main Agent] Technical Agent processing completed.")


    # Save technical output for reference (optional)
    os.makedirs("backend/data/tmp", exist_ok=True)
    technical_tmp_path = "backend/data/tmp/technical_output.json"

    with open(technical_tmp_path, "w") as f:
        json.dump(technical_output, f, indent=2)

    print(f"[Main Agent] Saved technical output → {technical_tmp_path}")



    # -------------------------------------------------------
    # STEP 4 — Run Pricing Agent
    # -------------------------------------------------------
    print("\n[Main Agent] Passing SKU selections + test requirements to Pricing Agent...")

    pricing_output = run_pricing_agent(
        technical_output,      # SKU mapping table
        rfp_json               # Full RFP JSON containing test requirements
    )

    print("[Main Agent] Pricing Agent completed.")



    # -------------------------------------------------------
    # STEP 5 — Merge Outputs into Final Response
    # -------------------------------------------------------
    print("\n[Main Agent] Combining Technical + Pricing responses...")

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
    # STEP 6 — Save Final Output
    # -------------------------------------------------------
    os.makedirs("backend/data/output", exist_ok=True)
    final_output_path = "backend/data/output/final_rfp_response.json"

    with open(final_output_path, "w") as f:
        json.dump(final_response, f, indent=2)

    print(f"[Main Agent] Final RFP Response saved → {final_output_path}")



    print("\n==================== MAIN AGENT END ====================\n")

    return final_response



# Allow direct script execution
if __name__ == "__main__":
    print("\n========== MAIN AGENT TEST START ==========\n")

    from agents.sales_agent.sales_agent import run_sales_agent
    from agents.technical_agent.technical_agent import run_technical_agent
    from agents.pricing_agent.pricing_agent import run_pricing_agent

    # 1. RUN SALES AGENT
    sales_output = run_sales_agent()
    selected_rfp = sales_output["selected_rfp"]

    if not selected_rfp:
        print("❌ No eligible RFP found. Exiting.")
        exit()

    rfp_json_path = selected_rfp["rfp_link"]
    print(f"[Main Agent] Selected RFP JSON: {rfp_json_path}")

    # 2. RUN TECHNICAL AGENT
    technical_output = run_technical_agent(rfp_json_path)

    # Save technical output for Pricing Agent
    tmp_tech_path = "backend/data/tmp/technical_output.json"
    import json, os
    os.makedirs("backend/data/tmp", exist_ok=True)
    with open(tmp_tech_path, "w") as f:
        json.dump(technical_output, f, indent=2)

    print(f"[Main Agent] Technical output saved → {tmp_tech_path}")

    # 3. RUN PRICING AGENT
    pricing_output = run_pricing_agent(
        technical_output=technical_output,
        rfp_json_path=rfp_json_path
    )

    # Save final output
    final_path = "backend/data/output/final_rfp_response.json"
    os.makedirs("backend/data/output", exist_ok=True)
    with open(final_path, "w") as f:
        json.dump(pricing_output, f, indent=2)

    print(f"\n[Main Agent] FINAL RESPONSE SAVED → {final_path}")

    print("\n========== MAIN AGENT TEST END ==========\n")

