import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EXPIRE_MINUTES = os.getenv("EXPIRE_MINUTES")

FRONTEND_URL = os.getenv("FRONTEND_URL")

ADMIN_CREDENTIALS = [
    (os.getenv("ADMIN_EMAIL_1"), os.getenv("ADMIN_PASS_1")),
    (os.getenv("ADMIN_EMAIL_2"), os.getenv("ADMIN_PASS_2")),
    (os.getenv("ADMIN_EMAIL_3"), os.getenv("ADMIN_PASS_3")),
]

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")