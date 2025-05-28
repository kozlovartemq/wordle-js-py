import logging
from contextlib import asynccontextmanager, closing
from fastapi.responses import ORJSONResponse
from sqlalchemy import text
import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.models.db_helper import db_helper
from core.models.base import Base
from api.v1 import router as v1_router
import sqlite3


settings.logging.setup_logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from core.models.game import delete_old_games, create_daily_game

    async with db_helper.engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        
    # create dictionary table
    with closing(sqlite3.connect(settings.db.name)) as sqlite3_conn:
        cursor = sqlite3_conn.cursor()
        with open("words-russian-nouns.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()

        cursor.executescript(sql_script)
        sqlite3_conn.commit()

    # launch scheduler that will delete games (24 hour old games every day by default)
    scheduler: AsyncIOScheduler | None = None
    if settings.deleteJob.enable:
        scheduler = AsyncIOScheduler()

        async def delete_old_games_job():
            async with db_helper.session_factory() as session:
                await delete_old_games(session, delta_hours=settings.deleteJob.threshold_hours)
        
        async def create_daily_game_job():
            async with db_helper.session_factory() as session:
                await create_daily_game(session, to_replace=False)
        
        scheduler.add_job(
            delete_old_games_job,
            "interval",
            hours=settings.deleteJob.interval_hours,
            id="Delete Old Games"
        )

        scheduler.add_job(
            create_daily_game_job,
            trigger=CronTrigger(hour=0, minute=0, second=5, timezone="UTC"),
            id="Create Daily Game",
            replace_existing=True
        )
        scheduler.start()
        logging.info("[lifespan][AsyncIOScheduler] Jobs set:\n%s", scheduler.get_jobs())
        # run the jobs at the application start
        await delete_old_games_job()
        await create_daily_game_job()

    yield
    if scheduler:
        scheduler.shutdown()
    await db_helper.dispose()
    

app = FastAPI(
    title="Wordle app (Backend)",
    lifespan=lifespan,
    default_response_class=ORJSONResponse,
    # root_path="/proxy/8000"
)
app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        f"http://localhost:{settings.run.port}",
        f"http://127.0.0.1:{settings.run.port}",
        f"http://localhost:3000",
        f"http://127.0.0.1:3000"
    ],
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