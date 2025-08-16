# Pydantic model for validation
from pydantic import BaseModel

class Course(BaseModel):
    course_name: str
    course_code: str
    hours: int