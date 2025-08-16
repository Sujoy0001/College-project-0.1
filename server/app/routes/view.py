from fastapi import APIRouter, HTTPException, Response
from db.database import teachers_collection, courses_collection, allotments_collection
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

router = APIRouter()

# ✅ Get details for a specific teacher
@router.get("/teacher/view/{teacher_email}")
async def view_teacher_details(teacher_email: str):
    teacher = await teachers_collection.find_one({"email": teacher_email})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    allotment = await allotments_collection.find_one({"teacher_email": teacher_email})
    if not allotment:
        raise HTTPException(status_code=404, detail="No courses assigned to this teacher")

    courses = []
    for cid in allotment.get("course_ids", []):
        course = await courses_collection.find_one({"id": cid})
        if course:
            courses.append({
                "course_name": course["course_name"],
                "course_code": course["course_code"],
                "hours": course["hours"]
            })

    return {
        "teacher": {
            "name": teacher["name"],
            "email": teacher["email"],
        },
        "courses": courses
    }


# ✅ Download Teacher PDF
@router.get("/teacher/download/{teacher_email}")
async def download_teacher_pdf(teacher_email: str):
    teacher = await teachers_collection.find_one({"email": teacher_email})
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    allotment = await allotments_collection.find_one({"teacher_email": teacher_email})
    if not allotment:
        raise HTTPException(status_code=404, detail="No courses assigned to this teacher")

    courses = []
    for cid in allotment.get("course_ids", []):
        course = await courses_collection.find_one({"id": cid})
        if course:
            courses.append({
                "course_name": course["course_name"],
                "course_code": course["course_code"],
                "hours": course["hours"]
            })

    # Generate PDF
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 14)
    p.drawString(200, 750, "Teacher Allotment Report")

    p.setFont("Helvetica", 12)
    p.drawString(50, 700, f"Teacher Name: {teacher['name']}")
    p.drawString(50, 680, f"Email: {teacher['email']}")
    p.drawString(50, 660, "Assigned Courses:")

    y = 640
    for course in courses:
        p.drawString(70, y, f"{course['course_name']} ({course['course_code']}) - {course['hours']} hrs")
        y -= 20

    p.showPage()
    p.save()

    pdf_data = buffer.getvalue()
    buffer.close()

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=teacher_{teacher_email}_report.pdf"}
    )


# ✅ View All Allotments (Admin) with clean output
@router.get("/admin/view-all")
async def view_all_allotments():
    results = []
    async for allotment in allotments_collection.find():
        teacher = await teachers_collection.find_one({"email": allotment.get("teacher_email")})
        if not teacher:
            continue

        course_list = []
        for cid in allotment.get("course_ids", []):
            course = await courses_collection.find_one({"id": cid})
            if course:
                course_list.append({
                    "course_name": course["course_name"],
                    "course_code": course["course_code"],
                    "hours": course["hours"]
                })

        results.append({
            "teacher_name": teacher.get("name", "Unknown"),
            "teacher_email": teacher.get("email", "N/A"),
            "courses": course_list
        })
    return {"allotments": results}


# ✅ Download All Allotments PDF (Clean)
@router.get("/admin/download-all")
async def download_all_allotments_pdf():
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 14)
    p.drawString(200, 750, "All Teachers Allotment Report")

    y = 720
    async for allotment in allotments_collection.find():
        teacher = await teachers_collection.find_one({"email": allotment.get("teacher_email")})
        if not teacher:
            continue

        # Teacher info
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, f"{teacher.get('name', 'Unknown')} - {teacher.get('email', 'N/A')}")
        y -= 20

        # Courses
        p.setFont("Helvetica", 11)
        for cid in allotment.get("course_ids", []):
            course = await courses_collection.find_one({"id": cid})
            if course:
                p.drawString(70, y, f"{course['course_name']} ({course['course_code']}) - {course['hours']} hrs")
                y -= 15
        y -= 10

        if y < 50:  # Start a new page if space is low
            p.showPage()
            y = 750

    p.showPage()
    p.save()

    pdf_data = buffer.getvalue()
    buffer.close()

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=all_teachers_report.pdf"}
    )
