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
    

class RunConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 8000


class DatabaseConfig(BaseModel):
    name: str = "database.sqlite3"
    echo: bool = False
    
    @property
    def url(self) -> str:
        return f"sqlite+aiosqlite:///{BASE_DIR}/{self.name}"


class Setting(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.template", ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG__",
    )
    main_api_prefix: str = "/api"
    run: RunConfig = RunConfig()
    logging: LoggingConfig = LoggingConfig()
    db: DatabaseConfig = DatabaseConfig()


settings = Setting()
