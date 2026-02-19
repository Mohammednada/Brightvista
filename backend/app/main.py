import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.middleware import RequestLoggingMiddleware
from app.database import init_db

# Import all models so they're registered with Base.metadata
from app.models import patient, case, procedure, document, payer, payer_rule, submission, appeal, voice_call, outcome, user  # noqa: F401

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("brightvista")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Brightvista PA Engine...")
    await init_db()
    logger.info("Database tables created.")

    # Seed data on first run
    from app.seed import seed_if_empty
    await seed_if_empty()
    logger.info("Seed data check complete.")

    yield
    logger.info("Shutting down Brightvista PA Engine.")


app = FastAPI(
    title=settings.app_name,
    description="Prior Authorization Engine — AI-powered case building, submission, and management",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging
app.add_middleware(RequestLoggingMiddleware)

# Register API routes
from app.api.v1 import cases, patients, submissions, payers, monitoring, appeals, websocket, auth, analytics, ai  # noqa: E402

app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(cases.router, prefix="/api/v1", tags=["Cases"])
app.include_router(patients.router, prefix="/api/v1", tags=["Patients"])
app.include_router(submissions.router, prefix="/api/v1", tags=["Submissions"])
app.include_router(payers.router, prefix="/api/v1", tags=["Payers"])
app.include_router(monitoring.router, prefix="/api/v1", tags=["Monitoring"])
app.include_router(appeals.router, prefix="/api/v1", tags=["Appeals"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(ai.router, prefix="/api/v1", tags=["AI"])
app.include_router(websocket.router, prefix="/api/v1", tags=["WebSocket"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": settings.app_name, "version": "0.1.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "database": "connected"}
