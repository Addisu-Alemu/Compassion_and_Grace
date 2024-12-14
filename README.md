# Students and Attendance Management System

This project is a **full-stack application** for managing students' information and their attendance records. It provides a backend API built with **FastAPI** and a frontend user interface developed with **React**. The system allows CRUD operations for both **students** and their **attendance records**.

---

## Features

### Backend (FastAPI)
- **Students Management**: Add, update, view, and delete student records.
- **Attendance Tracking**: Log attendance for each student with a date.
- **Relational Database**: Connects students with their attendance data using SQLAlchemy relationships.
- **CRUD Operations**: Exposed RESTful API endpoints.
- **Database**: PostgreSQL for data persistence.
- **CORS Support**: Enables communication with the frontend React app.

### Frontend (React)
- **Student Form**: Add or update student information.
- **Attendance Form**: Record attendance for students.
- **Dynamic Table**: Displays a list of students and their attendance.
- **User-Friendly UI**: Styled with TailwindCSS.
- **Responsive Design**: Optimized for all screen sizes.

---

## Technologies Used

### Backend:
- **FastAPI** (Python)
- **SQLAlchemy** with SQLModel
- **PostgreSQL** (Database)
- **Pydantic** (Data Validation)
- **CORS Middleware**

### Frontend:
- **React** (JavaScript/JSX)
- **Axios** (HTTP Client for API requests)
- **TailwindCSS** (Styling Framework)

### Tools:
- **Visual Studio Code**
- **Git & GitHub**

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Python 3.9+
- Node.js & npm
- PostgreSQL
- Git

### Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/Compassion_and_Grace.git
   cd Compassion_and_Grace
   ```
2. **Create a Virtual Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install fastapi uvicorn sqlmodel psycopg2-binary pydantic
   ```
4. **Set Up PostgreSQL**:
   - Create a PostgreSQL database.
   - Update the connection details in your FastAPI code.
5. **Run the Backend Server**:
   ```bash
   uvicorn main:app --reload
   ```
6. Access the API at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Frontend Setup
1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the React Development Server**:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at: [http://localhost:5175](http://localhost:5175)

---

## API Endpoints

### Students Endpoints:
| Method | Endpoint                | Description             |
|--------|-------------------------|-------------------------|
| GET    | `/students/`            | Fetch all students      |
| POST   | `/students/`            | Add a new student       |
| PUT    | `/students/{id}`        | Update a student        |
| DELETE | `/students/{id}`        | Delete a student        |

### Attendance Endpoints:
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/attendances/`           | Fetch all attendance records    |
| POST   | `/attendances/`           | Add a new attendance record     |

---

## License
This project is licensed under the **MIT License**.

**Thank you for checking out the project!** 😊
