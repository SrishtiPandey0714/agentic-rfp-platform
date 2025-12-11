"""
sales_agent.py

Fully implemented Sales Agent module.

Responsibilities:
1. Scan mock HTML pages for RFP listings.
2. Extract RFP metadata: title, issuer, due_date, JSON link.
3. Filter RFPs due within the next 90 days.
4. Sort by earliest due date.
5. Select ONE RFP (per competition requirement).
6. Return structured summary for Main Agent.

This implementation uses html_loader.py for all HTML parsing.
"""

import os
import sys

# Add backend root to Python path so "loaders" becomes importable
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(BASE_DIR)

from datetime import datetime, timedelta

# Import helper HTML loader functions
from loaders.html_loader import (
    load_html,
    parse_rfp_items,
    extract_rfp_data
)





# -----------------------------------------------------------
# STEP 1 — Locate mock HTML listing files
# -----------------------------------------------------------

def locate_mock_sites() -> list:
    """Returns a list of paths to all mock HTML files under backend/data/mock_sites/."""

    mock_site_dir = "backend/data/mock_sites"

    if not os.path.exists(mock_site_dir):
        raise FileNotFoundError("Mock sites folder not found: backend/data/mock_sites")

    html_files = [
        os.path.join(mock_site_dir, f)
        for f in os.listdir(mock_site_dir)
        if f.endswith(".html")
    ]

    return html_files



# -----------------------------------------------------------
# STEP 2 — Extract ALL RFP entries from ALL HTML pages
# -----------------------------------------------------------

def extract_rfps_from_sites(html_files: list) -> list:
    """
    Loads each HTML file, finds all <div class='rfp-item'>,
    and extracts structured RFP data for each entry.
    """

    all_rfps = []

    for html_file in html_files:
        html_content = load_html(html_file)
        rfp_items = parse_rfp_items(html_content)

        for item in rfp_items:
            rfp_data = extract_rfp_data(item, html_file)
            all_rfps.append(rfp_data)

    return all_rfps



# -----------------------------------------------------------
# STEP 3 — Keep only RFPs due within next 90 days
# -----------------------------------------------------------

def filter_rfps_by_deadline(rfps: list) -> list:
    """Filters RFPs whose due_date is <= 90 days from today."""

    eligible = []
    today = datetime.today()
    deadline_limit = today + timedelta(days=90)

    for rfp in rfps:
        try:
            due_date = datetime.strptime(rfp["due_date"], "%Y-%m-%d")
        except Exception:
            continue  # skip malformed dates

        if due_date <= deadline_limit:
            eligible.append(rfp)

    return eligible



# -----------------------------------------------------------
# STEP 4 — Sort RFPs by due date ascending
# -----------------------------------------------------------

def sort_rfps_by_due_date(rfps: list) -> list:
    """Sort eligible RFPs by earliest due date."""

    try:
        return sorted(rfps, key=lambda r: datetime.strptime(r["due_date"], "%Y-%m-%d"))
    except:
        return rfps



# -----------------------------------------------------------
# STEP 5 — Select ONE RFP (the earliest deadline)
# -----------------------------------------------------------

def select_best_rfp(sorted_rfps: list) -> dict:
    """Return the RFP with the earliest due date."""

    if not sorted_rfps:
        return None

    return sorted_rfps[0]  # closest deadline



# -----------------------------------------------------------
# STEP 6 — Final formatted output
# -----------------------------------------------------------

def format_sales_agent_output(selected_rfp: dict, eligible_rfps: list) -> dict:
    """Creates the final structured response."""

    return {
        "selected_rfp": selected_rfp,
        "eligible_rfps": eligible_rfps,
        "total_eligible": len(eligible_rfps)
    }



# -----------------------------------------------------------
# STEP 7 — Entry point for Main Agent or API
# -----------------------------------------------------------

def run_sales_agent() -> dict:
    """
    Runs the full Sales Agent pipeline:

    1. Locate HTML listing pages
    2. Extract RFP entries
    3. Filter by deadline
    4. Sort by due date
    5. Select ONE RFP
    6. Format & return output
    """

    print("\n========== SALES AGENT STARTED ==========\n")

    # Step 1: Locate HTML files
    html_files = locate_mock_sites()
    print(f"[Sales Agent] Found {len(html_files)} HTML listing pages.")

    # Step 2: Extract RFP entries
    all_rfps = extract_rfps_from_sites(html_files)
    print(f"[Sales Agent] Extracted {len(all_rfps)} RFP entries from HTML pages.")

    # Step 3: Filter within 3 months
    eligible_rfps = filter_rfps_by_deadline(all_rfps)
    print(f"[Sales Agent] {len(eligible_rfps)} RFPs are due within the next 90 days.")

    # Step 4: Sort RFPs
    sorted_rfps = sort_rfps_by_due_date(eligible_rfps)

    # Step 5: Select one RFP
    selected_rfp = select_best_rfp(sorted_rfps)
    if selected_rfp:
        print(f"[Sales Agent] Selected RFP: {selected_rfp['title']} (Due: {selected_rfp['due_date']})")
    else:
        print("[Sales Agent] No eligible RFPs found.")

    # Step 6: Format final output
    output = format_sales_agent_output(selected_rfp, sorted_rfps)

    print("\n========== SALES AGENT COMPLETED ==========\n")
    return output


if __name__ == "__main__":
    result = run_sales_agent()
    import json
    print(json.dumps(result, indent=2))

# -----------------------------------------------------------
# END OF MODULE
# -----------------------------------------------------------