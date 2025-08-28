import uvicorn
import sqlite3
import logging
from contextlib import asynccontextmanager, closing
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from sqlalchemy import text
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from core.config import settings, common_settings
from core.models.db_helper import db_helper
from core.models.base import Base
from api.v1 import router as v1_router


settings.logging.setup_logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from core.service import delete_old_games, create_daily_game

    async with db_helper.engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        
    # create dictionary table
    with closing(sqlite3.connect(settings.db.name)) as sqlite3_conn:
        cursor = sqlite3_conn.cursor()
        with open("words-russian-nouns.sql", "r", encoding="utf-8") as f:
            sql_script = f.read()

        cursor.executescript(sql_script)
        sqlite3_conn.commit()

    # launch scheduler that will create daily game AND delete games (24 hour old games every day by default)
    scheduler = AsyncIOScheduler()
    run_on_start_jobs = []
    
    async def create_daily_game_job():
        async with db_helper.session_factory() as session:
            await create_daily_game(session, to_replace=False)

    hour, minute, second = common_settings.daily_update_time_utc.split(':')
    scheduler.add_job(
        create_daily_game_job,
        trigger=CronTrigger(hour=hour, minute=minute, second=second, timezone="UTC"),
        id="Create Daily Game",
        replace_existing=True
    )
    run_on_start_jobs.append(create_daily_game_job)

    if settings.deleteJob.enable:

        async def delete_old_games_job():
            async with db_helper.session_factory() as session:
                await delete_old_games(session, delta_hours=common_settings.game_threshold_hours) 
        
        scheduler.add_job(
            delete_old_games_job,
            "interval",
            hours=settings.deleteJob.interval_hours,
            id="Delete Old Games"
        )
        run_on_start_jobs.append(delete_old_games_job)

    scheduler.start()
    logging.info("[lifespan][AsyncIOScheduler] Jobs set:\n%s", scheduler.get_jobs())
    # run the jobs at the application start
    for job in run_on_start_jobs:
        await job()

    yield
    scheduler.shutdown()
    await db_helper.dispose()
    

app = FastAPI(
    title="Wordle app (Backend)",
    lifespan=lifespan,
    default_response_class=ORJSONResponse,
)
app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


    
if __name__ == "__main__":
    host = '127.0.0.1' if common_settings.debug else '0.0.0.0'
    uvicorn.run(
        "main:app",
        host=host,
        port=common_settings.run.server_port,
        log_config=None,
        reload=True)
