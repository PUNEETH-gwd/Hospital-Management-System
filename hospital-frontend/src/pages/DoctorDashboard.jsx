import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function DoctorDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [unitsRequired, setUnitsRequired] = useState("");

  const token = localStorage.getItem("token");

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
        { headers: { Authorization: token } }
      );

      setAppointments(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchBloodRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/blood/my",
        { headers: { Authorization: token } }
      );

      setBloodRequests(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {

      await axios.put(
        `http://localhost:5000/api/appointments/update/${id}`,
        { status },
        { headers: { Authorization: token } }
      );

      fetchAppointments();

    } catch (error) {
      console.log(error);
    }
  };

  const requestBlood = async () => {
    try {

      await axios.post(
        "http://localhost:5000/api/blood/request",
        {
          patientId,
          bloodGroup,
          unitsRequired,
          emergency: true
        },
        { headers: { Authorization: token } }
      );

      alert("Blood request sent");

      fetchBloodRequests();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchBloodRequests();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", background: "#f4f6f8", minHeight: "100vh" }}>
        <h2>Doctor Dashboard</h2>

        {/* Blood Requests */}
        <div style={sectionStyle}>

          <h3>Blood Requests</h3>

          {bloodRequests.length === 0 ? (
            <p>No blood requests</p>
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
                  <th style={tableHeader}>Patient</th>
                  <th style={tableHeader}>Blood Group</th>
                  <th style={tableHeader}>Units</th>
                  <th style={tableHeader}>Status</th>
                </tr>
              </thead>

              <tbody>
                {bloodRequests.map((req) => (
                  <tr key={req._id}>
                    <td style={tableCell}>{req.patient?.name}</td>
                    <td style={tableCell}>{req.bloodGroup}</td>
                    <td style={tableCell}>{req.unitsRequired}</td>
                    <td style={tableCell}>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <br />

          <input
            placeholder="Patient ID"
            style={inputStyle}
            onChange={(e) => setPatientId(e.target.value)}
          />

          <br /><br />

          <select
            style={inputStyle}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option>Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <br /><br />

          <input
            type="number"
            placeholder="Units Required"
            style={inputStyle}
            onChange={(e) => setUnitsRequired(e.target.value)}
          />

          <br /><br />

          <button style={buttonStyle} onClick={requestBlood}>
            Request Blood
          </button>

        </div>

        {/* Appointments */}
        <div style={sectionStyle}>

          <h3>Appointments</h3>

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
                  <th style={tableHeader}>Patient</th>
                  <th style={tableHeader}>Date</th>
                  <th style={tableHeader}>Status</th>
                  <th style={tableHeader}>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>

                    <td style={tableCell}>{appt.patient?.name}</td>

                    <td style={tableCell}>
                      {new Date(appt.date).toLocaleDateString()}
                    </td>

                    <td style={tableCell}>{appt.status}</td>

                    <td style={tableCell}>
                      {appt.status === "pending" && (
                        <>
                          <button
                            style={buttonStyle}
                            onClick={() => updateStatus(appt._id, "approved")}
                          >
                            Approve
                          </button>

                          {" "}

                          <button
                            style={buttonStyle}
                            onClick={() => updateStatus(appt._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
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

export default DoctorDashboard;