from fastapi import APIRouter
from core.config import settings
from api.v1.game.views import game_router

router = APIRouter(tags=["API v1"], prefix=settings.api_prefix_v1)
router.include_router(game_router)