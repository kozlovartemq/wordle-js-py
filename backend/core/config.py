from logging.config import dictConfig
from pathlib import Path
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent.parent


class LoggingConfig(BaseModel):
    
    LOG_FORMAT: str = "[%(asctime)s.%(msecs)03d] %(module)10s:%(lineno)-3d %(levelname)-7s - %(message)s"
    LOG_LEVEL: str = "INFO"

    @property
    def setup_logging(self):
        dictConfig({
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": self.LOG_FORMAT,
                    "datefmt": "%d-%m-%Y %H:%M:%S"
                },
            },
            "handlers": {
                "default": {
                    "class": "logging.StreamHandler",
                    "formatter": "default",
                    "stream": "ext://sys.stdout",
                },
            },
            "loggers": {
                "uvicorn": {
                    "handlers": ["default"],
                    "level": self.LOG_LEVEL,
                    "propagate": False,
                },
                "uvicorn.error": {
                    "handlers": ["default"],
                    "level": self.LOG_LEVEL,
                    "propagate": False,
                },
                "uvicorn.access": {
                    "handlers": ["default"],
                    "level": self.LOG_LEVEL,
                    "propagate": False,
                },
            },
            "root": {
                "level": self.LOG_LEVEL,
                "handlers": ["default"]
            },
        })
    

class DatabaseConfig(BaseModel):
    name: str = "database.sqlite3"
    echo: bool = False
    
    @property
    def url(self) -> str:
        return f"sqlite+aiosqlite:///{BASE_DIR}/{self.name}"


class DeletingGamesJobConfig(BaseModel):
    enable: bool = True
    # could be less than 1
    interval_hours: float = 24


class Setting(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.template", ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG__",
    )
    admin_secret: str = "admin"
    logging: LoggingConfig = LoggingConfig()
    db: DatabaseConfig = DatabaseConfig()
    deleteJob: DeletingGamesJobConfig = DeletingGamesJobConfig()


class RunConfig(BaseModel):
    # host: str = "127.0.0.1"
    host: str = "0.0.0.0"
    server_port: int = 8000


class CommonSetting(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../.env"),  # "../.env.template" is not supporting in VITE frontend, so we look into ../.env file only 
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="VITE__",
    )
    run: RunConfig = RunConfig()
    main_api_prefix: str = "/api"
    secondary_api_prefix: str = "/v1"
    game_threshold_hours: float = 24
    daily_update_time_utc: str = "00:00:05"


settings = Setting()
common_settings = CommonSetting()
