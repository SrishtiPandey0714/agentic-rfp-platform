from fastapi import APIRouter, HTTPException
from backend.agents.main_agent.main_agent import run_main_agent

router = APIRouter()

@router.post("/run-rfp")
@router.post("/run-pipeline")
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
    
@router.get("/rfp/{rfp_id}")
def get_rfp(rfp_id: str):
    # Load saved RFP pipeline result
    rfp_data = load_rfp_from_store(rfp_id)  # JSON / DB / file
    if not rfp_data:
        raise HTTPException(status_code=404, detail="RFP not found")
    return {
        "status": "success",
        "data": rfp_data
    }

