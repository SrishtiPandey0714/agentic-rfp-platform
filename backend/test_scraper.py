"""
Test script for web scraper
Run this to verify scraping works before integrating
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.web_scraper import scrape_rfp_sources

def test_scraper():
    """Test the web scraper with mock HTML files"""
    
    print("=" * 60)
    print("Testing RFP Web Scraper")
    print("=" * 60)
    
    # Use file:// URLs for local testing
    base_path = os.path.dirname(__file__)
    mock_sites = [
        f"file:///{os.path.join(base_path, 'static', 'mock_rfp_site1.html').replace(chr(92), '/')}",
        f"file:///{os.path.join(base_path, 'static', 'mock_rfp_site2.html').replace(chr(92), '/')}"
    ]
    
    print(f"\nScraping {len(mock_sites)} mock sites...")
    print()
    
    try:
        rfps = scrape_rfp_sources(mock_sites)
        
        print(f"✓ Successfully scraped {len(rfps)} RFPs\n")
        
        for i, rfp in enumerate(rfps, 1):
            print(f"RFP #{i}:")
            print(f"  Title: {rfp['title']}")
            print(f"  Issuer: {rfp['issuer']}")
            print(f"  Due Date: {rfp['due_date']}")
            print(f"  Description: {rfp['description'][:80]}...")
            print()
        
        print("=" * 60)
        print("✓ Scraper test passed! Ready to use.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nMake sure you have installed:")
        print("  pip install beautifulsoup4 requests")


if __name__ == "__main__":
    test_scraper()
