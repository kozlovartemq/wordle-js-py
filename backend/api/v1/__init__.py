from fastapi import APIRouter
from core.config import settings
from api.v1.game.views import game_router
from api.v1.admin.views import admin_router

router = APIRouter(prefix=f"{settings.main_api_prefix}/v1")
router.include_router(game_router)
router.include_router(admin_router)