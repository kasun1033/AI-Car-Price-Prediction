cd .\backend\
.venv\Scripts\activate                             
uvicorn src.app.main:server --reload  
http://127.0.0.1:8000 

TO run init_db.py --> python -m src.app.db.init_db