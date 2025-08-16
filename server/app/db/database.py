from motor.motor_asyncio import AsyncIOMotorClient

from config import MONGO_URL

client = AsyncIOMotorClient(MONGO_URL)

db = client["COLLEGEPROJECT01"]
teachers_collection = db["teachers"]
courses_collection = db["courses"]
allotments_collection = db["allotments"]