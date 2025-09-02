from fastapi import APIRouter, HTTPException
from app.models.teachers import teachers_register, teacher_login, ResetPasswordRequest
from app.db.database import teachers_collection
from app.utils.hash_pass import create_access_token
from app.utils.jwt_handler import hash_password, verify_password
from app.send_email import send_reset_email
from datetime import datetime, timedelta
import secrets

router = APIRouter()

# ✅ Get next teacher ID
async def get_next_teachers_id():
    last_teacher = await teachers_collection.find_one(sort=[("id", -1)])
    if last_teacher:
        return last_teacher["id"] + 1
    return 2501  # First teacher starts from 2501

# ✅ Register Teacher
@router.post("/register")
async def register(user: teachers_register):
    if await teachers_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    user_dict["id"] = await get_next_teachers_id()

    await teachers_collection.insert_one(user_dict)

    return {"message": "Teacher registered successfully", "id": user_dict["id"]}

# ✅ Teacher Login
@router.post("/login")
async def login(user: teacher_login):
    user_in_db = await teachers_collection.find_one({"email": user.email})

    if not user_in_db:
        raise HTTPException(status_code=404, detail="Email not registered")

    if not verify_password(user.password, user_in_db["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({
        "id": user_in_db["id"],
        "name": user_in_db["name"],
        "email": user_in_db["email"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": user_in_db["email"],
    }

@router.get("/list")
async def list_teachers():
    try:
        teachers = []
        async for teacher in teachers_collection.find({}, {"password": 0}):
            teachers.append({
                "id": str(teacher["_id"]),
                "name": teacher.get("name"),
                "email": teacher.get("email"),
                "dept": teacher.get("dept")
            })
        return teachers
    except Exception as e:
        return {"error": str(e)}

# ✅ Delete Teacher by Email
@router.delete("/delete/{email}")
async def delete_teacher(email: str):
    result = await teachers_collection.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": f"Teacher with email {email} deleted successfully"}

@router.post("/forgot-password")
async def reset_password(request: ResetPasswordRequest):
    # Find user by email
    user = await teachers_collection.find_one({"email": request.email})

    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")

    # Hash and update password
    hashed_pw = hash_password(request.password)
    await teachers_collection.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_pw}, "$unset": {"reset_token": "", "reset_expires": ""}}
    )

    return {"message": "Password reset successfully"}
