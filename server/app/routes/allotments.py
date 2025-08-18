from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
from app.db.database import teachers_collection, courses_collection, allotments_collection

router = APIRouter()

class AllotmentRequest(BaseModel):
    teacher_email: EmailStr
    course_ids: List[int]

# ✅ Create or Update Allotment
@router.post("/allotments/assign")
async def assign_courses(allotment: AllotmentRequest):
    # Check teacher exists
    teacher = await teachers_collection.find_one({"email": allotment.teacher_email})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Check courses exist
    valid_courses = []
    for course_id in allotment.course_ids:
        course = await courses_collection.find_one({"id": course_id})
        if not course:
            raise HTTPException(status_code=404, detail=f"Course ID {course_id} not found")
        valid_courses.append(course_id)

    # Check if allotment already exists for this teacher
    existing_allotment = await allotments_collection.find_one({"teacher_email": allotment.teacher_email})
    if existing_allotment:
        # Update allotment: merge old + new course IDs without duplicates
        updated_courses = list(set(existing_allotment.get("course_ids", []) + valid_courses))
        await allotments_collection.update_one(
            {"teacher_email": allotment.teacher_email},
            {"$set": {"course_ids": updated_courses}}
        )
        return {
            "message": f"Courses updated for teacher {teacher['name']}",
            "teacher_email": allotment.teacher_email,
            "courses": updated_courses
        }
    else:
        # Insert new allotment
        await allotments_collection.insert_one({
            "teacher_id": teacher["id"],
            "teacher_email": teacher["email"],
            "teacher_name": teacher["name"],
            "course_ids": valid_courses
        })
        return {
            "message": f"Courses assigned to teacher {teacher['name']} successfully",
            "teacher_email": allotment.teacher_email,
            "courses": valid_courses
        }

# ✅ Edit Allotment (Add or Remove Courses)
@router.put("/allotments/edit")
async def edit_allotment(allotment: AllotmentRequest):
    teacher = await teachers_collection.find_one({"email": allotment.teacher_email})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Validate provided courses
    valid_courses = []
    for course_id in allotment.course_ids:
        course = await courses_collection.find_one({"id": course_id})
        if not course:
            raise HTTPException(status_code=404, detail=f"Course ID {course_id} not found")
        valid_courses.append(course_id)

    existing_allotment = await allotments_collection.find_one({"teacher_email": allotment.teacher_email})

    if not existing_allotment:
        # No allotment yet — just create a new one
        await allotments_collection.insert_one({
            "teacher_id": teacher["id"],
            "teacher_email": teacher["email"],
            "teacher_name": teacher["name"],
            "course_ids": valid_courses
        })
        return {
            "message": f"New allotment created for {teacher['name']}",
            "teacher_email": allotment.teacher_email,
            "courses": valid_courses
        }

    # If allotment exists — update courses without full replace
    current_courses = set(existing_allotment.get("course_ids", []))
    new_courses = set(valid_courses)

    # Merge: Add new, Remove missing from new list
    updated_courses = list(new_courses)

    await allotments_collection.update_one(
        {"teacher_email": allotment.teacher_email},
        {"$set": {"course_ids": updated_courses}}
    )

    return {
        "message": f"Allotment updated for {teacher['name']}",
        "teacher_email": allotment.teacher_email,
        "courses": updated_courses
    }


# ✅ Delete Allotment
@router.delete("/allotments/delete/{teacher_email}")
async def delete_allotment(teacher_email: EmailStr):
    result = await allotments_collection.delete_one({"teacher_email": teacher_email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Allotment not found for this teacher")
    return {"message": f"Allotments for teacher {teacher_email} deleted successfully"}
