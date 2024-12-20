import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ping.router import router as ping_router
from pedestrian_flow.router import router as pedestrian_router
from database import Base, engine
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(
    title="API",
    root_path="/api"
)

# Получение разрешённых источников из переменных окружения
origins = os.getenv("ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ping_router)
app.include_router(pedestrian_router)