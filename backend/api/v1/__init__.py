from fastapi import APIRouter
from core.config import settings
from api.v1.game.views import game_router

router = APIRouter(prefix=f"{settings.main_api_prefix}/v1")
router.include_router(game_router)