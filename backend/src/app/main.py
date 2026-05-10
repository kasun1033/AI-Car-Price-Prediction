from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from sqlalchemy.exc import SQLAlchemyError
import logging
import os
from .api.auth_routes import auth_router
from .api.google_auth_routes import google_auth_router
from .api.prediction_routes import prediction_router
from .api.admin_routes import admin_router
from .api.feedback_routes import feedback_router
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Development mode - set to False in production
DEBUG_MODE = os.getenv("DEBUG_MODE", "false").lower() == "true"

server = FastAPI(
    title="Car Price Prediction System",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:3000",  
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# validation error handler 
@server.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors.
    Returns unified error format with field-specific errors.
    """
    errors = []
    for error in exc.errors():
        field = error["loc"][-1] if error["loc"] else "unknown"
        message = error["msg"]
        
        if message.startswith("Value error, "):
            message = message.replace("Value error, ", "")
        
        errors.append({
            "field": str(field),
            "message": message
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": errors[0]["message"] if errors else "Validation error",
            "errors": errors
        }
    )

# HTTP exception handler
@server.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP exceptions.
    Returns unified error format.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "errors": None
        }
    )

# Database error handler
@server.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """
    Handle database errors.
    Logs actual error for developers, returns safe message to users.
    """

    logger.error(
        f"Database error on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True
    )
    
    # In development, optionally return detailed error
    if DEBUG_MODE:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "Database error occurred. Please try again later.",
                "errors": None,
                "debug_info": str(exc)  
            }
        )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Database error occurred. Please try again later.",
            "errors": None
        }
    )

# Generic exception handler
@server.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all for unexpected errors.
    Logs actual error for developers, returns safe message to users.
    """

    logger.error(
        f"Unexpected error on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True
    )
    
    if DEBUG_MODE:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected error occurred. Please try again.",
                "errors": None,
                "debug_info": {
                    "type": type(exc).__name__,
                    "message": str(exc)
                } 
            }
        )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected error occurred. Please try again.",
            "errors": None
        }
    )

# Include routers
server.include_router(auth_router, prefix="/api")
server.include_router(google_auth_router, prefix="/api")
server.include_router(prediction_router, prefix="/api")
server.include_router(admin_router, prefix="/api")
server.include_router(feedback_router, prefix="/api")

@server.on_event("startup")
def on_startup() -> None:
    """Run once when the application starts."""

    from .db.config import engine, Base
    from .db import models 
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified / created successfully.")
    except Exception:
        logger.exception("Failed to initialize database tables — check your DATABASE_URL and DB connectivity.")

    from .services.model_service import model_service
    try:
        model_service.load()
    except Exception:
        logger.exception(
            "Failed to load ML model — prediction endpoints will not work "
            "until the model files are available."
        )    

@server.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Server is running"
    }