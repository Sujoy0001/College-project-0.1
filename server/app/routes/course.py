from fastapi import APIRouter, HTTPException
from app.db.database import courses_collection  # We'll define this in database.py
from app.models.course import Course

router = APIRouter()

async def get_next_course_id():
    last_course = await courses_collection.find_one(sort=[("id", -1)])
    return last_course["id"] + 1 if last_course else 1

@router.post("/courses")
async def add_course(course: Course):
    # Check duplicate course code
    if await courses_collection.find_one({"course_code": course.course_code}):
        raise HTTPException(status_code=400, detail="Course code already exists")

    course_dict = course.dict()
    course_dict["id"] = await get_next_course_id()

    await courses_collection.insert_one(course_dict)

    return {"message": "Course added successfully", "course_id": course_dict["id"]}

@router.get("/courses/all")
async def get_all_courses():
    courses = []
    async for course in courses_collection.find():
        courses.append({
            "id": course["id"],
            "course_name": course["course_name"],
            "course_code": course["course_code"],
            "hours": course["hours"]
        })
    return {"courses": courses}


@router.delete("/courses/delete/{course_id}")
async def delete_course(course_id: int):
    result = await courses_collection.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": f"Course with ID {course_id} deleted successfully"}
