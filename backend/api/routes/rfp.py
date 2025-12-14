from fastapi import APIRouter, HTTPException
from backend.agents.main_agent.main_agent import run_main_agent

router = APIRouter(prefix="/api", tags=["RFP"])

@router.post("/run-rfp")
def run_rfp_pipeline():
    """
    Runs full RFP pipeline:
    Sales → Technical → Pricing → Final Response
    """

    try:
        result = run_main_agent()
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
