"""
ai_insights.py

Smart rule-based AI insights engine.
Analyzes page data and generates intelligent insights without external LLM.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import json

router = APIRouter()


class InsightsRequest(BaseModel):
    page_type: str
    page_data: Optional[Dict[str, Any]] = None


def analyze_dashboard(data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze dashboard data and generate insights."""
    
    pipeline = data.get('pipeline_status', {})
    counts = pipeline.get('counts', [0, 0, 0, 0, 0])
    total_rfps = data.get('total_rfps', 0)
    win_rate = data.get('win_rate', 0)
    
    # Calculate metrics
    discovered, analyzed, priced, submitted, won = counts
    conversion_rate = (won / discovered * 100) if discovered > 0 else 0
    
    # Generate summary
    summary = f"Currently tracking {total_rfps} RFP(s) in the pipeline with a {win_rate:.0f}% win rate. "
    if won > 0:
        summary += f"Successfully won {won} contract(s), demonstrating strong proposal quality."
    else:
        summary += "Focus on closing deals to improve win metrics."
    
    # Key metrics
    metrics = [
        {"label": "Total RFPs", "value": str(total_rfps)},
        {"label": "Win Rate", "value": f"{win_rate:.0f}%"},
        {"label": "Conversion Rate", "value": f"{conversion_rate:.0f}%"},
        {"label": "Active Pipeline", "value": str(discovered)}
    ]
    
    # Smart recommendations based on data
    recommendations = []
    if win_rate >= 80:
        recommendations.append("Excellent win rate - document your success factors for future RFPs")
    elif win_rate >= 50:
        recommendations.append("Good win rate - analyze won vs lost RFPs to identify improvement areas")
    else:
        recommendations.append("Improve win rate by enhancing technical specifications and competitive pricing")
    
    if conversion_rate < 50 and discovered > 0:
        recommendations.append("Many RFPs drop off before completion - streamline your qualification process")
    
    recommendations.append("Maintain consistent follow-up with prospects through submission stage")
    recommendations.append("Leverage AI agents to reduce response time and improve proposal quality")
    
    # Risk analysis
    risks = []
    if win_rate < 20 and total_rfps > 0:
        risks.append({
            "title": "Low Win Rate",
            "description": "Current win rate below industry benchmarks. Review pricing strategy and technical capabilities."
        })
    
    if conversion_rate < 30 and discovered > 2:
        risks.append({
            "title": "High Drop-off Rate",
            "description": "Many RFPs not converting to wins. Consider improving qualification criteria."
        })
    
    if not risks:
        risks.append({
            "title": "Pipeline Health",
            "description": "Monitor pipeline velocity and ensure consistent RFP flow for predictable revenue."
        })
    
    return {
        "summary": summary,
        "key_metrics": metrics,
        "recommendations": recommendations,
        "risks": risks
    }


def analyze_rfp_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze RFP response data."""
    
    tech = data.get('technical_analysis', {})
    pricing = data.get('pricing_analysis', {})
    items = tech.get('items', [])
    totals = pricing.get('totals', {})
    
    if not items:
        return {
            "summary": "No RFP response data available yet.",
            "key_metrics": [],
            "recommendations": ["Process an RFP to see detailed analysis"],
            "risks": []
        }
    
    # Calculate metrics
    avg_match = sum(item.get('final_match_percent', 0) for item in items) / len(items)
    perfect_matches = sum(1 for item in items if item.get('final_match_percent', 0) == 100)
    total_cost = totals.get('grand_total', 0)
    
    # Generate summary
    summary = f"RFP response covers {len(items)} product(s) with {avg_match:.1f}% average specification match. "
    if avg_match >= 90:
        summary += "Excellent technical compliance gives you competitive advantage."
    elif avg_match >= 70:
        summary += "Good match quality - address minor gaps in technical narrative."
    else:
        summary += "Review specification mismatches and consider alternative products."
    
    # Metrics
    metrics = [
        {"label": "Products", "value": str(len(items))},
        {"label": "Avg Spec Match", "value": f"{avg_match:.1f}%"},
        {"label": "Perfect Matches", "value": str(perfect_matches)},
        {"label": "Total Cost", "value": f"₹{total_cost:,.0f}"}
    ]
    
    # Recommendations
    recommendations = []
    if avg_match >= 95:
        recommendations.append("Highlight your superior technical compliance in executive summary")
    elif avg_match >= 80:
        recommendations.append("Explain specification variances and their benefits in technical section")
    else:
        recommendations.append("Consider alternative products or request specification clarification")
    
    recommendations.append("Include detailed comparison tables showing spec match percentages")
    recommendations.append("Validate pricing competitiveness against market benchmarks")
    
    if perfect_matches > 0:
        recommendations.append(f"Emphasize {perfect_matches} perfect match(es) as key differentiator")
    
    # Risks
    risks = []
    if avg_match < 85:
        risks.append({
            "title": "Specification Gaps",
            "description": f"Average match of {avg_match:.0f}% may reduce competitiveness. Review alternative products."
        })
    
    if total_cost == 0:
        risks.append({
            "title": "Missing Pricing",
            "description": "Pricing data incomplete. Ensure all costs calculated before submission."
        })
    
    low_match_items = [i for i in items if i.get('final_match_percent', 0) < 80]
    if low_match_items:
        risks.append({
            "title": "Low Match Products",
            "description": f"{len(low_match_items)} product(s) below 80% match. Consider alternatives or document deviations."
        })
    
    return {
        "summary": summary,
        "key_metrics": metrics,
        "recommendations": recommendations,
        "risks": risks
    }


def analyze_agent_page(page_type: str, page_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate insights for agent-specific pages based on actual data."""
    
    # If no data provided, ask user to run the agent
    if not page_data:
        return {
            "summary": "🔴 BACKEND CODE UPDATED - No data available yet. Run the Main Agent to generate insights for this page.",
            "key_metrics": [],
            "recommendations": ["Click 'Scan RFP Sources' on the Main Agent page to process RFPs and generate analysis"],
            "risks": []
        }
    
    # Technical Agent - Analyze SKU matching data
    if page_type == "technical_agent":
        items = page_data.get('items', [])
        
        if not items:
            return {
                "summary": "No technical items analyzed yet. Process an RFP to see SKU matching insights.",
                "key_metrics": [],
                "recommendations": ["Run the Main Agent to analyze technical specifications"],
                "risks": []
            }
        
        # Calculate metrics
        total_items = len(items)
        perfect_matches = sum(1 for item in items if item.get('final_match_percent', 0) == 100)
        partial_matches = sum(1 for item in items if 80 <= item.get('final_match_percent', 0) < 100)
        low_matches = sum(1 for item in items if item.get('final_match_percent', 0) < 80)
        avg_match = sum(item.get('final_match_percent', 0) for item in items) / total_items if total_items > 0 else 0
        
        # Generate summary
        summary = f"Analyzed {total_items} technical line item(s) with {avg_match:.1f}% average specification match. "
        if perfect_matches == total_items:
            summary += "All items are perfect matches - excellent technical compliance!"
        elif avg_match >= 90:
            summary += "Strong technical alignment with RFP requirements."
        elif avg_match >= 75:
            summary += "Good match quality with minor specification gaps."
        else:
            summary += "Review specification mismatches carefully."
        
        # Key metrics
        metrics = [
            {"label": "Total Items", "value": str(total_items)},
            {"label": "Perfect Matches", "value": str(perfect_matches)},
            {"label": "Partial Matches", "value": str(partial_matches)},
            {"label": "Avg Match %", "value": f"{avg_match:.1f}%"}
        ]
        
        # Recommendations
        recommendations = []
        if perfect_matches > 0:
            recommendations.append(f"Highlight {perfect_matches} perfect match(es) in your technical proposal as key differentiators")
        
        if partial_matches > 0:
            recommendations.append(f"{partial_matches} item(s) have 80-99% match - document minor deviations with technical justifications")
        
        if low_matches > 0:
            recommendations.append(f"{low_matches} item(s) below 80% match - consider alternative SKUs or request specification clarifications")
        
        if avg_match >= 95:
            recommendations.append("Emphasize superior technical compliance in executive summary")
        
        recommendations.append("Review comparison tables in 'View Details' for each item to understand match scoring")
        
        # Risks
        risks = []
        if low_matches > 0:
            risks.append({
                "title": "Low Match Items",
                "description": f"{low_matches} item(s) below 80% match may reduce competitiveness. Review alternatives."
            })
        
        if avg_match < 85:
            risks.append({
                "title": "Below Average Match",
                "description": f"Overall {avg_match:.0f}% match may be lower than competitors. Strengthen technical narrative."
            })
        
        return {
            "summary": summary,
            "key_metrics": metrics,
            "recommendations": recommendations,
            "risks": risks
        }
    
    # Sales Agent - Analyze opportunities
    elif page_type == "sales_agent":
        # Check if we have RFP data
        if not page_data or not page_data.get('rfp_id'):
            return {
                "summary": "No sales opportunities generated yet. Process RFPs to build your pipeline.",
                "key_metrics": [],
                "recommendations": ["Scan RFP sources to identify opportunities"],
                "risks": []
            }
        
        # Extract opportunity info from rfpData
        rfp_title = page_data.get('title', 'Unknown RFP')
        grand_total = page_data.get('summary', {}).get('grand_total_cost', 0)
        due_date = page_data.get('due_date', 'Unknown')
        
        summary = f"Tracking 1 sales opportunity: {rfp_title} worth ₹{grand_total:,.0f}. "
        summary += "Focus on qualification and timely submission to maximize win rate."
        
        metrics = [
            {"label": "Opportunities", "value": "1"},
            {"label": "Pipeline Value", "value": f"₹{grand_total:,.0f}"},
            {"label": "Due Date", "value": due_date}
        ]
        
        recommendations = [
            f"Review deadline ({due_date}) and prioritize based on submission timeline",
            "Ensure technical and pricing analysis is complete before submission",
            "Monitor win probability and focus on high-confidence opportunities (70%+)",
            "Follow up with technical and pricing teams for final review"
        ]
        
        return {
            "summary": summary,
            "key_metrics": metrics,
            "recommendations": recommendations,
            "risks": []
        }
    
    # Pricing Agent - Analyze costs
    elif page_type == "pricing_agent":
        pricing_summary = page_data.get('pricing_summary', [])
        totals = page_data.get('totals', {})
        
        if not pricing_summary:
            return {
                "summary": "No pricing data available yet. Run technical analysis first.",
                "key_metrics": [],
                "recommendations": ["Complete technical analysis to generate pricing"],
                "risks": []
            }
        
        total_items = len(pricing_summary)
        grand_total = totals.get('grand_total', 0)
        material_total = totals.get('total_material_cost', 0)
        test_total = totals.get('total_test_cost', 0)
        
        summary = f"Pricing completed for {total_items} item(s) with ₹{grand_total:,.0f} total cost. "
        summary += "Validate competitiveness before submission."
        
        metrics = [
            {"label": "Line Items", "value": str(total_items)},
            {"label": "Material Cost", "value": f"₹{material_total:,.0f}"},
            {"label": "Test Cost", "value": f"₹{test_total:,.0f}"},
            {"label": "Grand Total", "value": f"₹{grand_total:,.0f}"}
        ]
        
        recommendations = [
            "Verify unit prices in pricing tables are current and competitive",
            "Review test cost calculations for accuracy",
            "Consider volume discounts for large quantity orders",
            "Validate total pricing against budget constraints and market benchmarks"
        ]
        
        return {
            "summary": summary,
            "key_metrics": metrics,
            "recommendations": recommendations,
            "risks": []
        }
    
    # Main Agent or unknown - Generic guidance
    else:
        return {
            "summary": "Main Agent orchestrates the complete RFP workflow from scanning to final response generation.",
            "key_metrics": [],
            "recommendations": [
                "Click 'Scan RFP Sources' to process RFPs",
                "Monitor execution progress and review results on specialized agent pages",
                "Use Technical, Sales, and Pricing dashboards for detailed insights"
            ],
            "risks": []
        }


@router.post("")
def generate_insights(request: InsightsRequest):
    """Generate AI insights using rule-based analytics."""
    try:
        page_type = request.page_type.lower()
        page_data = request.page_data or {}
        
        print(f"=== AI Insights Backend ===")
        print(f"Received page_type: {page_type}")
        print(f"Received page_data keys: {list(page_data.keys()) if page_data else 'None'}")
        
        if page_type == "dashboard":
            print("→ Using analyze_dashboard")
            insights = analyze_dashboard(page_data)
        elif page_type == "rfp_response":
            print("→ Using analyze_rfp_response")
            insights = analyze_rfp_response(page_data)
        else:
            # Agent pages - now with data analysis
            print(f"→ Using analyze_agent_page with type: {page_type}")
            insights = analyze_agent_page(page_type, page_data)
        
        print(f"Generated insights summary: {insights.get('summary', '')[:100]}...")
        
        return {
            "status": "success",
            "insights": insights
        }
        
    except Exception as e:
        print(f"ERROR in generate_insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")
