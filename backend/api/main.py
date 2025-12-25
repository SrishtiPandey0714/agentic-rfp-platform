from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.rfp import router as rfp_router
from api.routes.dashboard import router as dashboard_router
from api.routes.ai_insights import router as ai_insights_router

# ✅ Step 1: Create app FIRST
app = FastAPI(
    title="Agentic RFP Platform API",
    version="1.0.0"
)

# ✅ Step 2: Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",  # Allow all Vercel preview & production deployments
        "https://agentic-rfp-platform.vercel.app"  # Add your specific domain after deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Step 3: Include routers
app.include_router(rfp_router, prefix="/api/rfp", tags=["RFP"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(ai_insights_router, prefix="/api/ai-insights", tags=["AI Insights"])

# Optional health check
@app.get("/")
def health():
    return {"status": "ok"}
