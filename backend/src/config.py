from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_PORT = os.getenv("DB_PORT")

# Проверяем, что все переменные окружения загружены
if not all([DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME]):
    raise ValueError("Не все переменные окружения для подключения к базе данных заданы.")
