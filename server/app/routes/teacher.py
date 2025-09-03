from fastapi import APIRouter, HTTPException
from app.models.teachers import teachers_register, teacher_login, RequestEmail, ResetPasswordRequest
from app.db.database import teachers_collection
from app.utils.hash_pass import create_access_token
from app.utils.jwt_handler import hash_password, verify_password

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import SMTP_EMAIL, SMTP_PASSWORD

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
    raw_password = user.password 
    user_dict["password"] = hash_password(user.password)
    user_dict["id"] = await get_next_teachers_id()

    await teachers_collection.insert_one(user_dict)

    # Prepare email request model
    send_email(to_email=user.email, raw_password=raw_password, name=user.name)

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



# email send for share user email and password for login 

def send_email(to_email: str, raw_password: str, name: str):
    subject = "Welcome to Teacher Login Portal 🎉"
    body = f"""
    Hi {name},

    Your account has been successfully created! 🎓
    
    Here are your login details:
    Email: {to_email}
    Password: {raw_password}

    Please keep this information safe. You can change your password after logging in.

    Regards,
    TCA System
    """

    # Create the email
    message = MIMEMultipart()
    message["From"] = SMTP_EMAIL
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # Secure connection with Gmail SMTP
    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, message.as_string())
        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")