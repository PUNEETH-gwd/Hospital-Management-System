import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [bloodData, setBloodData] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [beds, setBeds] = useState([]);
  const [bedNumber, setBedNumber] = useState("");
  const [type, setType] = useState("");
  const [patientId, setPatientId] = useState("");

  const token = localStorage.getItem("token");

  const cardStyle = {
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minWidth: "180px",
    textAlign: "center"
  };

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

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments/admin/stats",
        { headers: { Authorization: token } }
      );
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBloodDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/blood/dashboard",
        { headers: { Authorization: token } }
      );
      setBloodData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addBloodStock = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/blood/stock",
        { bloodGroup, units: Number(units) },
        { headers: { Authorization: token } }
      );

      alert("Blood stock updated");
      fetchBloodDashboard();

    } catch (error) {
      console.log(error);
    }
  };

  const fetchBeds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/beds/all",
        { headers: { Authorization: token } }
      );

      setBeds(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addBed = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/beds/add",
        { bedNumber, type },
        { headers: { Authorization: token } }
      );

      alert("Bed added");
      fetchBeds();

    } catch (error) {
      console.log(error);
    }
  };

  const assignBed = async (bedId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/beds/assign/${bedId}`,
        { patientId },
        { headers: { Authorization: token } }
      );

      alert("Bed assigned");
      fetchBeds();

    } catch (error) {
      console.log(error);
    }
  };

  const dischargeBed = async (bedId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/beds/discharge/${bedId}`,
        {},
        { headers: { Authorization: token } }
      );

      alert("Patient discharged");
      fetchBeds();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBloodDashboard();
    fetchBeds();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", background: "#f4f6f8", minHeight: "100vh" }}>
        <h2>Admin Dashboard</h2>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            <div style={cardStyle}>
              <h4>Total Users</h4>
              <p>{stats.totalUsers}</p>
            </div>

            <div style={cardStyle}>
              <h4>Doctors</h4>
              <p>{stats.totalDoctors}</p>
            </div>

            <div style={cardStyle}>
              <h4>Patients</h4>
              <p>{stats.totalPatients}</p>
            </div>

            <div style={cardStyle}>
              <h4>Appointments</h4>
              <p>{stats.totalAppointments}</p>
            </div>
          </div>
        )}

        {/* Blood Dashboard */}
        <div style={sectionStyle}>
          <h3>Blood Bank Dashboard</h3>

          {bloodData ? (
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={cardStyle}>
                <h4>Total Blood Groups</h4>
                <p>{bloodData.totalBloodGroups}</p>
              </div>

              <div style={cardStyle}>
                <h4>Total Units</h4>
                <p>{bloodData.totalUnitsAvailable}</p>
              </div>

              <div style={cardStyle}>
                <h4>Emergency</h4>
                <p>{bloodData.emergencyRequests}</p>
              </div>

              <div style={cardStyle}>
                <h4>Approved</h4>
                <p>{bloodData.approvedRequests}</p>
              </div>
            </div>
          ) : (
            <p>Loading blood data...</p>
          )}
        </div>

        {/* Add Blood Stock */}
        <div style={sectionStyle}>
          <h3>Add Blood Stock</h3>

          <select style={inputStyle} onChange={(e) => setBloodGroup(e.target.value)}>
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
            placeholder="Units"
            onChange={(e) => setUnits(e.target.value)}
            style={inputStyle}
          />

          <br /><br />

          <button style={buttonStyle} onClick={addBloodStock}>
            Add Stock
          </button>
        </div>

        {/* Bed Management */}
        <div style={sectionStyle}>
          <h3>Bed Management</h3>

          <input
            placeholder="Bed Number"
            onChange={(e) => setBedNumber(e.target.value)}
            style={inputStyle}
          />

          <br /><br />

          <select onChange={(e) => setType(e.target.value)} style={inputStyle}>
            <option>Select Type</option>
            <option>ICU</option>
            <option>General</option>
          </select>

          <br /><br />

          <button style={buttonStyle} onClick={addBed}>
            Add Bed
          </button>
        </div>

        {/* Beds Table */}
        <div style={sectionStyle}>
          <h3>All Beds</h3>

          {beds.length === 0 ? (
            <p>No beds available</p>
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
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Bed Number</th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Type</th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Status</th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Patient</th>
                  <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {beds.map((bed) => (
                  <tr key={bed._id}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{bed.bedNumber}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{bed.type}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {bed.isOccupied ? "Occupied" : "Available"}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {bed.patient?.name || "-"}
                    </td>

                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {!bed.isOccupied ? (
                        <>
                          <input
                            placeholder="Patient ID"
                            style={inputStyle}
                            onChange={(e) => setPatientId(e.target.value)}
                          />
                          <br /><br />
                          <button style={buttonStyle} onClick={() => assignBed(bed._id)}>
                            Assign
                          </button>
                        </>
                      ) : (
                        <button style={buttonStyle} onClick={() => dischargeBed(bed._id)}>
                          Discharge
                        </button>
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

export default AdminDashboard;