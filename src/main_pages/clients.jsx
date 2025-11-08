//uppdate doesnt update email
//import "../Login.css";
import "../style/Login.css";

import { useState, useEffect } from "react";
import PrimaryCities from "../assests/cities.json";

import { clientAPI } from "../services/backendservices.js";
import MainPage from "./mainpage.jsx";

function Client() {
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = [];
    acc[item.state].push(item.name);
    return acc;
  }, {});

  useEffect(() => {
    fetchClients().catch((err) => {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
    });
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const res = await clientAPI.getAllClients();
      console.log("getAllClients response:", res.data);
      if (res?.data?.status) {
        setClients(res.data.data || []);
      } else {
        console.warn("getAllClients response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      alert("Failed to fetch clients. See console.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errs = {};
    if (!inputs.f_name || inputs.f_name.trim().length < 2)
      errs.f_name = "First name required";
    if (!inputs.email || !/\S+@\S+\.\S+/.test(inputs.email))
      errs.email = "Valid email required";
    if (!inputs.phone || !/^\d{10}$/.test(String(inputs.phone)))
      errs.phone = "10 digit phone required";
    if (!inputs.city_name) errs.city_name = "Please select city";
    if (!inputs.dob) errs.dob = "DOB required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      client_id: inputs.client_id || null,
      f_name: inputs.f_name,
      l_name: inputs.l_name || "",
      email: inputs.email || "",
      phone: Number(inputs.phone) || 0,
      state_name: inputs.state,
      city_name: inputs.city_name,
      dob: inputs.dob ? new Date(inputs.dob).toISOString() : null,
      gender: inputs.gender || "",
      note: inputs.note || "",
    };

    try {
      let res;
      if (formMode === "update") {
        // remove email since backend rejects it
        const { email, ...updatePayload } = payload;
        res = await clientAPI.updateClient(updatePayload);
      } else {
        res = await clientAPI.addClient(payload);
      }

      if (res?.data?.status) {
        alert(res.data.msg);
        setInputs({});
        setShowForm(false);
        fetchClients();
      } else {
        alert(res?.data?.error || "Operation failed");
      }
    } catch (err) {
      console.error("Client submit error:", err);
      alert("Error submitting client. See console.");
    }
  }

  async function handleDelete(clientId) {
    if (!window.confirm(`Are you sure you want to delete this client?`)) return;

    try {
      const res = await clientAPI.deleteClient({ client_id: clientId });
      if (res?.data?.status) {
        alert("Client deleted successfully");
        setClients((prev) => prev.filter((c) => c.client_id !== clientId));
      } else {
        alert(res?.data?.error || "Failed to delete client");
      }
    } catch (err) {
      console.error("Delete client error:", err);
      alert("Error deleting client. See console.");
    }
  }

  function handleUpdate(client) {
    setShowForm(true);
    setFormMode("update");
    setInputs({
      client_id: client.client_id,
      f_name: client.f_name,
      l_name: client.l_name,
      email: client.email, // keep email to display
      phone: client.phone,
      state_name: client.state_name,
      city_name: client.city_name,
      dob: client.dob.split("T")[0],
      gender: client.gender,
      note: client.note,
    });
  }
  // 🔍 Filter clients
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.f_name?.toLowerCase().includes(term) ||
      c.l_name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.city_name?.toLowerCase().includes(term)
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortOption) return 0;

    let aValue = a[sortOption];
    let bValue = b[sortOption];

    // Special handling for Date of Birth
    if (sortOption === "dob") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <>
      <MainPage />
      <br />
      <label className="heading">Client list</label>
      <br />

      <button
        className="clientbutton"
        onClick={() => {
          setShowForm(true);
          setFormMode("add");
          setInputs({});
          setErrors({});
        }}
      >
        Add Client +
      </button>
      {/* Popup form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ×
            </button>
            <h4>
              {formMode === "update" ? "Update Client" : "Add New Client"}
            </h4>

            <form onSubmit={handleSubmit}>
              <label>First Name:</label>
              <input
                name="f_name"
                value={inputs.f_name || ""}
                onChange={handleChange}
                placeholder="First name"
              />
              {errors.f_name && <p className="error">{errors.f_name}</p>}

              <label>Last Name:</label>
              <input
                name="l_name"
                value={inputs.l_name || ""}
                onChange={handleChange}
                placeholder="Last name (optional)"
              />

              <label>Email:</label>
              <input
                name="email"
                value={inputs.email || ""}
                onChange={handleChange}
                placeholder="Email"
                disabled={formMode === "update"}
              />
              {errors.email && <p className="error">{errors.email}</p>}

              <label>Date Of Birth:</label>
              <input
                type="date"
                name="dob"
                value={inputs.dob || ""}
                onChange={handleChange}
              />
              {errors.dob && <p className="error">{errors.dob}</p>}

              <label>Gender:</label>
              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={inputs.gender === "Male"}
                    onChange={handleChange}
                  />{" "}
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={inputs.gender === "Female"}
                    onChange={handleChange}
                  />{" "}
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={inputs.gender === "Other"}
                    onChange={handleChange}
                  />{" "}
                  Other
                </label>
              </div>

              <label>State:</label>
              <select
                name="state"
                value={inputs.state || ""}
                onChange={(e) => {
                  handleChange(e);
                  /* clear city when state changes */ setInputs((prev) => ({
                    ...prev,
                    city_name: "",
                  }));
                }}
              >
                <option value="">Select State</option>
                {Object.keys(cities).map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {inputs.state && (
                <>
                  <label>City:</label>
                  <select
                    name="city_name"
                    value={inputs.city_name || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select City</option>
                    {cities[inputs.state]?.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city_name && (
                    <p className="error">{errors.city_name}</p>
                  )}
                </>
              )}

              <label>Number:</label>
              <input
                name="phone"
                value={inputs.phone || ""}
                onChange={handleChange}
                placeholder="10-digit phone"
              />
              {errors.phone && <p className="error">{errors.phone}</p>}

              <label>Note:</label>
              <textarea
                name="note"
                value={inputs.note || ""}
                onChange={handleChange}
                rows="3"
              />

              <button className="submit-btn" type="submit">
                {formMode === "update" ? "Update Client" : "Add Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table showing clients */}

      <div className="search-sort-bar">
        {/*} <label className="search-sort-heading">Search Client</label>*/}

        <input
          type="text"
          placeholder="Search by name, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {/*} <label className="search-sort-heading">Search Client</label>*/}
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by...</option>
          <option value="f_name">First Name</option>
          <option value="l_name">Last Name</option>
          <option value="email">Email</option>
          <option value="dob">Date of Birth</option>
        </select>

        <select
          className="sort-direction-dropdown"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="client-table">
        <br />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>State</th>
                <th>City</th>
                <th>Phone</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.length === 0 ? (
                <tr>
                  <td colSpan="9">No matching clients</td>
                </tr>
              ) : (
                sortedClients.map((c, i) => (
                  <tr key={i}>
                    <td>{c.f_name}</td>
                    <td>{c.l_name}</td>
                    <td>{c.email}</td>
                    <td>{c.dob ? c.dob.split("T")[0] : ""}</td>
                    <td>{c.gender}</td>
                    <td>{c.state_name}</td>
                    <td>{c.city_name}</td>
                    <td>{c.phone}</td>
                    <td title={c.note}>
                      {c.note?.length > 30
                        ? c.note.substring(0, 30) + "..."
                        : c.note}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => handleUpdate(c)}>Update</button>
                        <button onClick={() => handleDelete(c.client_id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Client;
