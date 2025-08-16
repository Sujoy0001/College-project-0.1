from pydantic import BaseModel, EmailStr
from typing import Literal 

class teachers_register(BaseModel):
    name: str
    email: EmailStr
    dept: Literal["CSE", "IT", "ME", "CE", "ECE"]
    password: str
    
class teacher_login(BaseModel):
    email: str
    password: str