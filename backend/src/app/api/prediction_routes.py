from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
import logging

from ..services.prediction_service import PredictionService
from ..utils.dependencies import get_current_user
from ..schemas.auth_schemas import ErrorResponse
from ..schemas.prediction_schemas import MetadataOut, MetadataResponse, PredictionHistoryOut, PredictionHistoryPagination, PredictionHistoryResponse, PredictionResponse, PredictionIn, PredictionCountResponse
from ..services.model_service import model_service
from ..db.config import get_db
from ..db.models import User
from ..utils.ip import get_client_ip
from ..utils.rate_limiter import rate_limit

logger = logging.getLogger(__name__)

prediction_router = APIRouter(prefix="/predictions", tags=["Predictions"])

# get metadata for prediction
@prediction_router.get(
    "/metadata",
    response_model=MetadataResponse,
    status_code=status.HTTP_200_OK,
    summary="Get metadata for prediction",
    responses={
        200: {
            "description": "Metadata retrieved successfully",
            "model": MetadataResponse
        },
        429: {
            "description": "Too many requests. Please try again later.",
            "model": ErrorResponse
        },
        503: {
            "description": "Model not loaded yet",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def get_metadata(request: Request) -> MetadataResponse:
    try:
        # rate limiting
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"get_metadata:{client_ip}", max_attempts=20)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        if model_service.model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is not loaded yet. Please try again later."
            )

        data = model_service.get_metadata()
        return MetadataResponse(
            data=MetadataOut(**data)
        )

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Unexpected error getting metadata: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve metadata. Please try again later."
        )


# predict car price
@prediction_router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict car price",
    responses={
        200: {
            "description": "Car price predicted successfully",
            "model": PredictionResponse
        },
        422: {
            "description": "Unsupported brand/model or invalid input",
            "model": ErrorResponse
        },
        429: {
            "description": "Too many requests. Please try again later.",
            "model": ErrorResponse
        },
        503: {
            "description": "Model not loaded yet",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def predict(
    request: Request,
    payload: PredictionIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> PredictionResponse:
    try:
        # rate limiting
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"predict:{client_ip}", max_attempts=20)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        if model_service.model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is not loaded yet. Please try again later."
            )

        raw_input = payload.model_dump()

        # predict the price
        predicted_price, warnings = model_service.predict(raw_input)

        # save the prediction to the db
        prediction_service = PredictionService(db)
        prediction_log = prediction_service.save_prediction(
            user_id=current_user.id,
            input_payload=raw_input,
            predicted_price_lkr=predicted_price,
            warnings=warnings
        )

        return PredictionResponse(
            prediction_id=prediction_log.id,
            predicted_price_lkr=predicted_price,
            warnings=warnings
        )

    except HTTPException:
        raise

    except ValueError as ve:
        logger.warning(f"Prediction input validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )

    except Exception as e:
        logger.error(f"Unexpected error predicting car price: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to predict car price. Please try again later."
        )


# get prediction history of the user
@prediction_router.get(
    "/history",
    response_model=PredictionHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get prediction history of the user",
    responses={
        200: {
            "description": "Prediction history retrieved successfully",
            "model": PredictionHistoryResponse
        },
        404: {
            "description": "No prediction history found for this user",
            "model": ErrorResponse
        },
        429: {
            "description": "Too many requests. Please try again later.",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def get_prediction_history(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> PredictionHistoryResponse:
    try:
        # rate limiting
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"get_prediction_history:{client_ip}", max_attempts=20)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        prediction_service = PredictionService(db)
        offset = (page - 1) * limit
        prediction_history = prediction_service.get_prediction_history(
            current_user.id,
            limit=limit,
            offset=offset,
        )
        total = prediction_service.get_user_prediction_count(current_user.id)
        total_pages = (total + limit - 1) // limit


        # if not prediction_history:
        #     raise HTTPException(
        #         status_code=status.HTTP_404_NOT_FOUND,
        #         detail="No prediction history found for this user"
        #     )

        return PredictionHistoryResponse(
            data=[PredictionHistoryOut(
                id=ph.id,
                input_payload=ph.input_payload,
                predicted_price_lkr=ph.predicted_price_lkr,
                warnings=ph.warnings,
                created_at=ph.created_at,
                feedbacks=ph.feedbacks
            ) for ph in prediction_history],
            pagination=PredictionHistoryPagination(
                page=page,
                limit=limit,
                total=total,
                total_pages=total_pages,
                has_next=page < total_pages,
                has_previous=page > 1,
            ),
        )

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Unexpected error getting prediction history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction history. Please try again later."
        )


# get the total number of predictions
@prediction_router.get(
    "/count",
    status_code=status.HTTP_200_OK,
    summary="Get the total number of predictions",
    responses={
        200: {
            "description": "Total number of predictions retrieved successfully",
            "model": PredictionCountResponse
        },
        429: {
            "description": "Too many requests. Please try again later.",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def get_prediction_count(
    request: Request,
    db: Session = Depends(get_db),
) -> PredictionCountResponse:
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"get_prediction_count:{client_ip}", max_attempts=20)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        prediction_service = PredictionService(db)
        prediction_count = prediction_service.get_prediction_count()

        return PredictionCountResponse(
            count=prediction_count
        )

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Unexpected error getting prediction count: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction count. Please try again later."
        )        


# delete a prediction log
@prediction_router.delete(
    "/history/{prediction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a prediction log",
    responses={
        204: {"description": "Prediction deleted successfully"},
        404: {"description": "Prediction not found", "model": ErrorResponse},
        429: {"description": "Too many requests", "model": ErrorResponse},
        500: {"description": "Internal server error", "model": ErrorResponse},
    }
)
async def delete_prediction(
    prediction_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        client_ip = get_client_ip(request)
        is_allowed = await rate_limit(f"delete_prediction:{client_ip}", max_attempts=30)

        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

        prediction_service = PredictionService(db)
        deleted = prediction_service.delete_prediction(prediction_id, str(current_user.id))

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found."
            )

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Unexpected error deleting prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete prediction. Please try again later."
        )