from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ml

app = FastAPI(
    title="Buddha Institute of Technology - ML & ERP API",
    description="Python FastAPI backend hosting machine learning models for placement prediction and AI RAG analysis.",
    version="1.0.0"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(ml.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BIT Gorakhpur ML Backend API",
        "docs_url": "/docs"
    }
