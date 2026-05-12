from ..db.models import PredictionLog
from sqlalchemy.orm import Session, joinedload

class PredictionService:
    def __init__(self, db: Session):
        self.db = db
        
    # save the prediction to the database
    def save_prediction(
        self,
        user_id: str,    
        input_payload: dict,
        predicted_price_lkr: float,
        warnings: list[str] | None = None
    ) -> PredictionLog:
        try:
            log_entry = PredictionLog(
                user_id=user_id,
                input_payload=input_payload,
                predicted_price_lkr=predicted_price_lkr,
                warnings=warnings
            )
            self.db.add(log_entry)
            self.db.commit()
            self.db.refresh(log_entry)
            return log_entry
        except Exception as e:
            self.db.rollback()
            raise e


    # get prediction history of the user
    def get_prediction_history(
        self,
        user_id: str,
        limit: int = 20,
        offset: int = 0,
    ) -> list[PredictionLog]:
        try:
            return (
                self.db.query(PredictionLog)
                .options(joinedload(PredictionLog.feedbacks))
                .filter(PredictionLog.user_id == user_id)
                .order_by(PredictionLog.created_at.desc())
                .offset(offset)
                .limit(limit)
                .all()
            )
        except Exception as e:
            raise e

    def get_user_prediction_count(self, user_id: str) -> int:
        try:
            return (
                self.db.query(PredictionLog)
                .filter(PredictionLog.user_id == user_id)
                .count()
            )
        except Exception as e:
            raise e

    # get the total number of predictions
    def get_prediction_count(self) -> int:
        try:
            return self.db.query(PredictionLog).count()
        except Exception as e:
            raise e

    # delete a prediction 
    def delete_prediction(
        self,
        prediction_id: str,
        user_id: str
    ) -> bool:
        try:
            log = (
                self.db.query(PredictionLog)
                .filter(
                    PredictionLog.id == prediction_id,
                    PredictionLog.user_id == user_id
                )
                .first()
            )
            if not log:
                return False
            self.db.delete(log)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e

           