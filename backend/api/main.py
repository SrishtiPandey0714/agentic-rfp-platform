from fastapi import FastAPI
from backend.api.routes.rfp import router as rfp_router

app = FastAPI(title="Agentic RFP Platform")

app.include_router(rfp_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
