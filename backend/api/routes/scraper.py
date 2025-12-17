"""
Web Scraper API Routes
Optional endpoint for testing web scraping functionality
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add services directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

try:
    from backend.services.web_scraper import scrape_rfp_sources
except ImportError:
    scrape_rfp_sources = None

router = APIRouter()


class ScrapeRequest(BaseModel):
    urls: Optional[List[str]] = None


@router.post("/scrape")
def scrape_rfp_sites(request: ScrapeRequest = None):
    """
    Scrape RFP listing sites and return structured data
    
    Optional endpoint - demonstrates web scraping capability
    """
    if scrape_rfp_sources is None:
        raise HTTPException(
            status_code=501,
            detail="Web scraper module not available. Install beautifulsoup4 and requests."
        )
    
    try:
        urls = request.urls if request and request.urls else None
        rfps = scrape_rfp_sources(urls)
        
        return {
            "status": "success",
            "count": len(rfps),
            "rfps": rfps
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: {str(e)}"
        )


@router.get("/scrape/test")
def test_scraper():
    """Quick test endpoint to verify scraper works"""
    if scrape_rfp_sources is None:
        return {
            "status": "error",
            "message": "Scraper not available - install dependencies: pip install beautifulsoup4 requests"
        }
    
    return {
        "status": "ready",
        "message": "Web scraper is available. Use POST /api/scraper/scrape to scrape RFP sites."
    }
