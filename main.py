from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from pydantic import BaseModel

# Define SQLModel table (this is your students database model)
class Students(SQLModel, table=True):  # Renamed to "Students"
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int
    grade: str
    school: str
    living_area: str
    phone: str

    attendances: Optional[List["Attendance"]] = Relationship(
        back_populates="student", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

# Define Pydantic model for request validation (for POST request)
class StudentsCreate(BaseModel):  # Renamed to "StudentsCreate"
    name: str
    age: int
    grade: str
    school: str
    living_area: str
    phone: str

# Define Pydantic model for response (GET request)
class StudentsResponse(BaseModel):  # Renamed to "StudentsResponse"
    id: int
    name: str
    age: int
    grade: str
    school: str
    living_area: str
    phone: str

    class Config:
        from_attributes = True  # Updated to match Pydantic v2





# Attendance Table
class Attendance(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    date: str = Field(default=None, index=True)  # Date column
    student_name: str = Field(index=True)  # Adding student's name column
    student_id: Optional[int] = Field(default=None, foreign_key="students.id")
    status: str = Field(index=True)  # Present/Absent/Other status

    # Relationship to Students
    student: Optional[Students] = Relationship(back_populates="attendances")

class AttendanceResponse(BaseModel):
    id: int
    date: str
    status: str
    student_id: int

    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    date: str
    status: str
    student_id: int





# PostgreSQL database configuration
postgres_username = "postgres"
postgres_password = "postgres"
postgres_host = "localhost"
postgres_port = "5432"
postgres_db = "postgres"

# Create the PostgreSQL database URL
postgres_url = f"postgresql://{postgres_username}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"

# Create the engine
engine = create_engine(postgres_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Depends(get_session)

app = FastAPI()

# Enable CORS for React app
origins = [
    "http://localhost:5173",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with a list of allowed origins for better security
    allow_credentials=True,
    allow_methods=["*"],  # Or specify allowed methods, e.g., ["GET", "POST"]
    allow_headers=["*"],  # Or specify allowed headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/students/", response_model=List[StudentsResponse])  # Updated to use "StudentsResponse"
def get_students(session: Session = Depends(get_session)):
    """Fetch all students records from the database"""
    students = session.exec(select(Students)).all()
    return students

@app.post("/students/", response_model=StudentsResponse)  # Updated to use "StudentsResponse"
def create_students(students: StudentsCreate, session: Session = Depends(get_session)):  # Updated to use "StudentsCreate"
    """Add a new students record to the database"""
    new_students = Students(**students.dict())  # Updated to use "Students"
    session.add(new_students)
    session.commit()
    session.refresh(new_students)
    return new_students

@app.delete("/students/{student_id}", response_model=StudentsResponse)
def delete_student(student_id: int, session: Session = Depends(get_session)):
    """Delete a student by ID"""
    student = session.get(Students, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    session.delete(student)
    session.commit()
    return student

@app.put("/students/{student_id}", response_model=StudentsResponse)
def update_student(student_id: int, updated_data: StudentsCreate, session: Session = Depends(get_session)):
    """Update a student's details"""
    student = session.get(Students, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in updated_data.dict().items():
        setattr(student, key, value)  # Update fields dynamically
    session.commit()
    session.refresh(student)
    return student


# --- Attendance Endpoints ---
@app.post("/attendance/", response_model=AttendanceResponse)
def create_attendance(attendance: AttendanceCreate, session: Session = Depends(get_session)):
    student = session.get(Students, attendance.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    new_attendance = Attendance(**attendance.dict())
    session.add(new_attendance)
    session.commit()
    session.refresh(new_attendance)
    return new_attendance

@app.get("/attendance/{student_id}", response_model=List[AttendanceResponse])
def get_attendance(student_id: int, session: Session = Depends(get_session)):
    student = session.get(Students, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    attendances = session.exec(select(Attendance).where(Attendance.student_id == student_id)).all()
    return attendances

