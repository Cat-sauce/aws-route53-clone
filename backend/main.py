from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine, SessionLocal
import app.models.entities
from app.seed.seed_data import seed_database
import app.routers.hosted_zone as hosted_zone
import app.routers.records as records

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(title="AWS Route 53 API Clone")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$|^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(hosted_zone.router)
app.include_router(records.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Route 53 Clone"}