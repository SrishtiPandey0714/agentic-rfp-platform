from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.rfp import router as rfp_router

# ✅ Step 1: Create app FIRST
app = FastAPI(
    title="Agentic RFP Platform API",
    version="1.0.0"
)

# ✅ Step 2: Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Step 3: Include routers
app.include_router(rfp_router, prefix="/api", tags=["RFP"])

# Optional health check
@app.get("/")
def health():
    return {"status": "ok"}
