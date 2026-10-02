from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import engine, SessionLocal, Base

# Import all models so SQLAlchemy creates tables
from app.models import component, test, measurement, diagnosis  # noqa

from app.api import tests, measurements, diagnosis as diag_api, reports, system, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        from app.database.seed import seed
        seed(db)
    finally:
        db.close()
    yield
    # Shutdown: nothing needed

app = FastAPI(
    title="AI-Driven Electronic Component Intelligence Platform",
    version="1.0.0",
    description="Intelligent electronic component testing and AI-powered diagnosis",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(system.router)
app.include_router(tests.router)
app.include_router(measurements.router)
app.include_router(diag_api.router)
app.include_router(reports.router)
app.include_router(history.router)

@app.get("/")
def root():
    return {"message": "AI Component Intelligence Platform API", "docs": "/docs"}
