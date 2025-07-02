from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_200_OK, HTTP_503_SERVICE_UNAVAILABLE

from api.v1.schemas import HealthCheckResponse, HealthCheckResponseSQLError
from core.models.db_helper import db_helper


health_router = APIRouter(tags=["Health"])


@health_router.get(
    '/health',
    summary="Health Check",
    response_model=HealthCheckResponse,
    responses={
        503: {
            "model": HealthCheckResponseSQLError,
            "description": "The database service is unavailable"
        }
    }
)
async def health_check(
    session: AsyncSession = Depends(db_helper.session_dependency)
):

    try:
        await session.execute(text("SELECT 1"))
        response = HealthCheckResponse()
        status_code = HTTP_200_OK
    except SQLAlchemyError as e:
        response = HealthCheckResponseSQLError(
            db_error=str(e)
        )
        status_code = HTTP_503_SERVICE_UNAVAILABLE
    
    return JSONResponse(
        content=response.model_dump(),
        status_code=status_code
    )
