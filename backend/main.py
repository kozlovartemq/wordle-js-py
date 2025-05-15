import logging
from contextlib import asynccontextmanager, closing
from fastapi.responses import ORJSONResponse
from sqlalchemy import text
import uvicorn

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.models.db_helper import db_helper
from core.models.base import Base
from game_handler import GameHandler
from api.v1 import router as v1_router
import sqlite3


settings.logging.setup_logging
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        
    # create dictionary table
    with closing(sqlite3.connect(settings.db.name)) as sqlite3_conn:
        cursor = sqlite3_conn.cursor()
        with open("words-russian-nouns.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()

        cursor.executescript(sql_script)
        sqlite3_conn.commit()

    yield
    await db_helper.dispose()
    

app = FastAPI(
    title="Wordle app (Backend)",
    lifespan=lifespan,
    default_response_class=ORJSONResponse,
)
app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://localhost:{settings.run.port}", f"http://127.0.0.1:{settings.run.port}"],
    allow_methods=["*"],
    allow_headers=["*"]
)


    
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        log_config=None,
        reload=True)