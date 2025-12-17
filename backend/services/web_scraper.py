"""
Web Scraper for RFP Sources
Scrapes mock RFP listing sites to extract opportunities
"""

from bs4 import BeautifulSoup
import requests
from typing import List, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class RFPScraper:
    """Simple web scraper for RFP listing sites"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_site(self, url: str) -> List[Dict[str, Any]]:
        """
        Scrape a single RFP listing site
        
        Args:
            url: URL of the RFP listing page
            
        Returns:
            List of RFP dictionaries with title, issuer, due_date, description
        """
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            rfps = []
            
            # Look for RFP listings (assumes class="rfp-item" structure)
            rfp_items = soup.find_all('div', class_='rfp-item')
            
            for item in rfp_items:
                try:
                    rfp = self._extract_rfp_data(item)
                    if rfp:
                        rfps.append(rfp)
                except Exception as e:
                    logger.warning(f"Failed to extract RFP item: {e}")
                    continue
            
            return rfps
            
        except requests.RequestException as e:
            logger.error(f"Failed to scrape {url}: {e}")
            return []
    
    def _extract_rfp_data(self, item_soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract RFP data from a single item"""
        
        # Extract title
        title_elem = item_soup.find('h3', class_='rfp-title')
        title = title_elem.text.strip() if title_elem else "Unknown RFP"
        
        # Extract issuer
        issuer_elem = item_soup.find('p', class_='rfp-issuer')
        issuer = issuer_elem.text.strip() if issuer_elem else "Unknown Issuer"
        
        # Extract due date
        date_elem = item_soup.find('span', class_='rfp-due-date')
        due_date = date_elem.text.strip() if date_elem else "Unknown"
        
        # Extract description
        desc_elem = item_soup.find('p', class_='rfp-description')
        description = desc_elem.text.strip() if desc_elem else ""
        
        # Extract link if available
        link_elem = item_soup.find('a', class_='rfp-link')
        link = link_elem.get('href', '') if link_elem else ""
        
        return {
            'title': title,
            'issuer': issuer,
            'due_date': due_date,
            'description': description,
            'link': link,
            'scraped_at': datetime.now().isoformat()
        }
    
    def scrape_multiple_sites(self, urls: List[str]) -> List[Dict[str, Any]]:
        """
        Scrape multiple RFP listing sites
        
        Args:
            urls: List of URLs to scrape
            
        Returns:
            Combined list of all RFPs from all sites
        """
        all_rfps = []
        for url in urls:
            logger.info(f"Scraping {url}...")
            rfps = self.scrape_site(url)
            all_rfps.extend(rfps)
            logger.info(f"Found {len(rfps)} RFPs from {url}")
        
        return all_rfps


# Convenience function for quick scraping
def scrape_rfp_sources(urls: List[str] = None) -> List[Dict[str, Any]]:
    """
    Scrape RFP sources and return structured data
    
    Args:
        urls: List of URLs to scrape. If None, uses default mock sites.
        
    Returns:
        List of RFP dictionaries
    """
    if urls is None:
        # Default mock sites (local HTML files or test URLs)
        urls = [
            'http://localhost:8000/static/mock_rfp_site1.html',
            'http://localhost:8000/static/mock_rfp_site2.html'
        ]
    
    scraper = RFPScraper()
    return scraper.scrape_multiple_sites(urls)
