"""
html_loader.py

This module is responsible ONLY for:
- Loading HTML files from disk
- Parsing HTML content
- Extracting RFP data from <div class="rfp-item"> blocks

It does NOT:
- Filter RFPs
- Sort them
- Choose the best RFP
Those responsibilities belong to the Sales Agent.
"""

import os
from bs4 import BeautifulSoup


# -----------------------------------------------------------
# FUNCTION 1: load_html()
# -----------------------------------------------------------

def load_html(file_path: str) -> str:
    """
    Loads an HTML file from the given file path and returns its content as text.

    Args:
        file_path (str): Path to the HTML file.

    Returns:
        str: Raw HTML content of the file.

    Raises:
        FileNotFoundError: If the file does not exist.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"HTML file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    return html_content



# -----------------------------------------------------------
# FUNCTION 2: parse_rfp_items()
# -----------------------------------------------------------

def parse_rfp_items(html_content: str):
    """
    Parses the HTML content and returns a list of all RFP blocks.
    Each RFP block is a <div class="rfp-item"> element.

    Args:
        html_content (str): Raw HTML content.

    Returns:
        list: List of BeautifulSoup elements corresponding to RFP items.
    """

    soup = BeautifulSoup(html_content, "html.parser")

    # Find all <div class="rfp-item"> blocks
    rfp_items = soup.find_all("div", class_="rfp-item")

    return rfp_items



# -----------------------------------------------------------
# FUNCTION 3: extract_rfp_data()
# -----------------------------------------------------------

def extract_rfp_data(item, html_file_path: str):
    """
    Extracts structured RFP information from a single <div class="rfp-item"> block.

    Args:
        item (bs4.element.Tag): A BeautifulSoup tag representing one RFP entry.
        html_file_path (str): Path to the HTML file (used to resolve relative links).

    Returns:
        dict: Dictionary containing structured RFP data:
              {
                "title": "...",
                "issuer": "...",
                "due_date": "...",
                "rfp_link": "...",   # absolute path to JSON file
                "source_html": "..." # path to the HTML page where this entry was found
              }
    """

    # Extract text from <span class="rfp-title">...</span>
    title_tag = item.find("span", class_="rfp-title")
    title = title_tag.text.strip() if title_tag else "Unknown Title"

    # Extract issuer
    issuer_tag = item.find("span", class_="rfp-issuer")
    issuer = issuer_tag.text.strip() if issuer_tag else "Unknown Issuer"

    # Extract due date
    due_date_tag = item.find("span", class_="rfp-due-date")
    due_date = due_date_tag.text.strip() if due_date_tag else None

    # Extract link to JSON file
    link_tag = item.find("a", class_="rfp-link")
    raw_link = link_tag["href"].strip() if link_tag and "href" in link_tag.attrs else None

    # Resolve link into absolute backend path
    rfp_json_path = resolve_rfp_path(raw_link, html_file_path)

    return {
        "title": title,
        "issuer": issuer,
        "due_date": due_date,
        "rfp_link": rfp_json_path,
        "source_html": html_file_path
    }



# -----------------------------------------------------------
# HELPER FUNCTION: resolve_rfp_path()
# -----------------------------------------------------------

def resolve_rfp_path(relative_link: str, html_file_path: str) -> str:
    """
    Converts a relative link like "../rfp_documents/rfp_001.json"
    into a correct absolute backend path.

    Args:
        relative_link (str): The path from the HTML file's perspective.
        html_file_path (str): Path of the HTML file.

    Returns:
        str: The resolved absolute path to the JSON RFP document.
    """

    if relative_link is None:
        return None

    # Get directory where the HTML file is located
    html_dir = os.path.dirname(html_file_path)

    # Combine HTML directory with relative link
    absolute_path = os.path.normpath(os.path.join(html_dir, relative_link))

    # Normalize for different OS path styles
    return absolute_path



# -----------------------------------------------------------
# END OF MODULE
# -----------------------------------------------------------