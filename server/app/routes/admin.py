from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.hash_pass import create_access_token
from config import ADMIN_CREDENTIALS

router = APIRouter()

class AdminLogin(BaseModel):
    email: str
    password: str

@router.post("/admin/login")
async def admin_login(admin: AdminLogin):
    if (admin.email, admin.password) in ADMIN_CREDENTIALS:
        token = create_access_token({"email": admin.email, "role": "admin"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "email": admin.email
        }
    raise HTTPException(status_code=401, detail="Invalid admin credentials")
