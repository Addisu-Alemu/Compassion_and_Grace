import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentsForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [livingArea, setLivingArea] = useState("");
  const [phone, setPhone] = useState("");
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To track if we're editing
  const [editId, setEditId] = useState(null); // ID of the student being edited
 


  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/students/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = {
      name,
      age,
      grade,
      school,
      living_area: livingArea,
      phone,
    };

    if (isEditing) {
      // Update existing student
      try {
        await axios.put(`http://127.0.0.1:8000/students/${editId}`, studentData);
        setIsEditing(false);
        setEditId(null);
      } catch (error) {
        console.error("Error updating student:", error);
      }
    } else {
      // Add new student
      try {
        await axios.post("http://127.0.0.1:8000/students/", studentData);
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }

    // Clear form and refresh list
    setName("");
    setAge("");
    setGrade("");
    setSchool("");
    setLivingArea("");
    setPhone("");
    fetchStudents();
  };

  // Delete a student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Edit a student
  const handleEdit = (student) => {
    setIsEditing(true);
    setEditId(student.id);
    setName(student.name);
    setAge(student.age);
    setGrade(student.grade);
    setSchool(student.school);
    setLivingArea(student.living_area);
    setPhone(student.phone);
  };




  useEffect(() => {
    fetchStudents();
  }, []);

  // const fetchAttendance = async (id) => {
  //   const response = await axios.get(`http://127.0.0.1:8000/attendance/${id}`);
  //   setAttendanceRecords(response.data);
  // };

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/attendance/");
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);


  const handleAddAttendance = async (e) => {
    e.preventDefault();
    const data = {
      student_id: studentId,
      date: attendanceDate,
      status: attendanceStatus,
    };
    await axios.post("http://127.0.0.1:8000/attendance/", data);
    fetchAttendance(studentId);
  };


  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Compassion and Grace Students
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">School</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Living Area</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={livingArea}
              onChange={(e) => setLivingArea(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`mt-6 w-full ${
            isEditing ? "bg-yellow-500" : "bg-blue-500"
          } text-white p-3 rounded-md hover:${
            isEditing ? "bg-yellow-700" : "bg-blue-700"
          }`}
        >
          {isEditing ? "Update Student" : "Add Student"}
        </button>
      </form>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Students List</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">School</th>
                <th className="px-6 py-3">Living Area</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.age}</td>
                    <td className="px-6 py-4">{student.grade}</td>
                    <td className="px-6 py-4">{student.school}</td>
                    <td className="px-6 py-4">{student.living_area}</td>
                    <td className="px-6 py-4">{student.phone}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center px-6 py-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>




      <h1>Manage Attendance</h1>
      <form onSubmit={handleAddAttendance}>
        <label>Student</label>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <label>Date</label>
        <input
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
          required
        />

        <label>Status</label>
        <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)} required>
          <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button type="submit">Add Attendance</button>
      </form>

      <div>
        <h2>Attendance Records</h2>
        {attendanceRecords.map((record) => (
          <div key={record.id}>
            <p>Date: {record.date}</p>
            <p>Status: {record.status}</p>
          </div>
        ))}
      </div>



      <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Attendance Table</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{record.date}</td>
                  <td className="px-6 py-4">{record.student_name}</td>
                  <td
                    className={`px-6 py-4 ${
                      record.status === "Present"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }`}
                  >
                    {record.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center px-6 py-4">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default StudentsForm;
