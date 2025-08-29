from fastapi import APIRouter
from core.config import common_settings
from api.v1.game.views import game_router
from api.v1.admin.views import admin_router
from api.v1.health.views import health_router


router = APIRouter(prefix=f"/v1")
router.include_router(game_router)
router.include_router(admin_router)
router.include_router(health_router)
