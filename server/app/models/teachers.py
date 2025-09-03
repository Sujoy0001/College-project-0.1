from pydantic import BaseModel, EmailStr
from typing import Literal , Optional
from datetime import datetime 

class teachers_register(BaseModel):
    name: str
    email: EmailStr
    dept: Literal["CSE", "IT", "ME", "CE", "ECE"]
    password: str
    
class teacher_login(BaseModel):
    email: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    password: str

class RequestEmail(BaseModel):
    email: EmailStr
    password: str
    name: str