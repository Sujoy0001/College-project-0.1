from fastapi import FastAPI
from app.routes import teacher, admin, course, allotments, view
from fastapi.middleware.cors import CORSMiddleware
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://tcasystem.vercel.app",
    "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index():
    return {"message": "Ami ar parchi na."}

app.include_router(teacher.router, prefix="/auth", tags=["auth"])
app.include_router(course.router, prefix="/add", tags=["course"])
app.include_router(allotments.router, tags=["allotements"])
app.include_router(view.router, tags=["view"])
app.include_router(admin.router, tags=["admin"] )

