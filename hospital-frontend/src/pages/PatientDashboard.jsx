import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function PatientDashboard() {

  const token = localStorage.getItem("token");

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const sectionStyle = {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    padding: "8px",
    width: "220px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "8px 14px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const tableHeader = {
    padding: "10px",
    borderBottom: "2px solid #ddd"
  };

  const tableCell = {
    padding: "10px",
    borderBottom: "1px solid #eee"
  };

  const fetchAppointments = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/appointments/my",
        {
          headers: { Authorization: token }
        }
      );

      setAppointments(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchDoctors = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/auth/doctors",
        {
          headers: { Authorization: token }
        }
      );

      setDoctors(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const bookAppointment = async () => {
    try {

      await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId,
          date
        },
        {
          headers: { Authorization: token }
        }
      );

      alert("Appointment booked");

      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", background: "#f4f6f8", minHeight: "100vh" }}>

        <h2>Patient Dashboard</h2>

        {/* Book Appointment */}
        <div style={sectionStyle}>

          <h3>Book Appointment</h3>

          <select
            style={inputStyle}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option>Select Doctor</option>

            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            type="date"
            style={inputStyle}
            onChange={(e) => setDate(e.target.value)}
          />

          <br /><br />

          <button
            style={buttonStyle}
            onClick={bookAppointment}
          >
            Book Appointment
          </button>

        </div>

        {/* My Appointments */}
        <div style={sectionStyle}>

          <h3>My Appointments</h3>

          <button
            style={buttonStyle}
            onClick={fetchAppointments}
          >
            Refresh Appointments
          </button>

          <br /><br />

          {appointments.length === 0 ? (
            <p>No appointments</p>
          ) : (

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px"
              }}
            >

              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={tableHeader}>Doctor</th>
                  <th style={tableHeader}>Date</th>
                  <th style={tableHeader}>Status</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map((appt) => (
                  <tr key={appt._id}>

                    <td style={tableCell}>
                      {appt.doctor?.name}
                    </td>

                    <td style={tableCell}>
                      {new Date(appt.date).toLocaleDateString()}
                    </td>

                    <td style={tableCell}>
                      {appt.status}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>
    </>
  );
}

export default PatientDashboard;