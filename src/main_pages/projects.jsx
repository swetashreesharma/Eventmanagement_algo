import "../Login.css";
import { useState, useEffect } from "react";
import MainPage from "./mainpage";
import axios from "axios";
import { clientAPI, projectAPI } from "../services/backendservices";

function Project() {
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({});
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("add");
   const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(""); 
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }
    axios
      .get("http://192.168.1.17:5000/api/clients/getallclients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Client API Response:", res.data);
        setClients(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
      });
  }, []);

  useEffect(() => {
    fetchProjects().catch((err) => {
      if (err.response?.status === 401) {
        alert("session expired . pls login again");
      }
    });
  }, []);
  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await projectAPI.getAllProjects();
      if (res?.data?.status) {
        setProjects(res.data.data || []);
      } else {
        console.log("getAllProjects response:", res.data);
      }
    } catch (err) {
      console.log("error fetchiong projects :", err);
      alert("failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate(values) {
    const newErrors = {};

    if (!values.name || values.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters long.";
    }
    if (!values.note || values.note.trim().length < 5) {
      newErrors.note = "Description must be at least 5 characters long.";
    }
    if (!values.client) {
      newErrors.client = "Please select a client.";
    }
    if (!values.cost) {
      newErrors.cost = "Cost is required.";
    } else if (isNaN(values.cost)) {
      newErrors.cost = "Cost must be a number.";
    } else if (Number(values.cost) <= 0) {
      newErrors.cost = "Cost must be greater than zero.";
    }

    return newErrors;
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(inputs);

    if (Object.keys(validationErrors).length) return;
    const payload = {
      project_id: inputs.project_id, // <-- important

      p_name: inputs.name,
      description: inputs.note,
      cost: Number(inputs.cost),
      client_id: Number(inputs.client),
    };
    try {
      let res;
      if (formMode === "update") {
        const { client_id, ...updatePayload } = payload;

        res = await projectAPI.updateProject(updatePayload);
      } else {
        const { project_id, ...addPayload } = payload;
        res = await projectAPI.addProject(addPayload);
      }
      if (res?.data?.status) {
        const newProject = { ...inputs, lastStatus: "" };
        setProjects((prev) => [...prev, newProject]);

        setInputs({});
        setShowForm(false);
        setErrors({});
        fetchProjects();
      } else {
        alert(res?.data?.error || "Operation failed");
      }
    } catch (err) {
      console.error("Project submit error:", err);
      alert("Error submitting project. See console.");
    }
  }
  const clientMap = Object.fromEntries(
    clients.map((c) => [c.client_id, `${c.f_name} ${c.l_name}`])
  );
  function handleUpdate(project) {
    setShowForm(true);
    setFormMode("update");
    setInputs({
      project_id: project.project_id,
      name: project.p_name,
      note: project.description,
      cost: project.cost,
      client: project.client_id,
    });
  }
async function handleDelete(project_id) {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete this project (${project_id})?`
  );
  if (!confirmDelete) return; // Only return if user CANCELS

  try {
    const res = await projectAPI.deleteProject({ project_id });
    if (res?.data?.status) {
      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the list
    } else {
      alert(res?.data?.error || "Failed to delete project");
    }
  } catch (err) {
    console.error("Delete project error:", err);
    alert("Error deleting project");
  }
}


    //  Filter Projects
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.p_name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.client_id?.toLowerCase().includes(term) ||
      p.cost?.toLowerCase().includes(term)
    );
  });

  const storedProjects = [...filteredProjects].sort((a, b) => {
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
          <label className="heading">Project List</label>
          <br />

      {/* Add Project Button */}
      <button className="clientbutton" onClick={() => setShowForm(true)}>
        Add Project +
      </button>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ×
            </button>
            <h4>
              {formMode === "update" ? "Update Project" : "Add New Project"}
            </h4>

            <form onSubmit={handleSubmit}>
              <label>Project Name:</label>
              <input
                type="text"
                name="name"
                value={inputs.name || ""}
                onChange={handleChange}
                placeholder="Enter Project Name"
              />
              {errors.name && <p>{errors.name}</p>}

              <label>Note:</label>
              <textarea
                name="note"
                value={inputs.note || ""}
                onChange={handleChange}
                placeholder="Enter description about the Project"
                rows="2"
              ></textarea>
              {errors.note && <p>{errors.note}</p>}

              <label>Client:</label>
              <select
                name="client"
                value={inputs.client || ""}
                onChange={handleChange}
                disabled={formMode === "update"}
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.client_id} value={c.client_id}>
                    {c.f_name} {c.l_name} – {c.city_name}
                  </option>
                ))}
              </select>

              {errors.client && <p>{errors.client}</p>}

              {errors.client && <p>{errors.client}</p>}

              <label>Cost:</label>
              <input
                type="text"
                name="cost"
                value={inputs.cost || ""}
                onChange={handleChange}
                placeholder="Enter Cost"
              />
              {errors.cost && <p>{errors.cost}</p>}

              <button className="submit-btn" type="submit">
                {formMode === "update" ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}


        <div className="search-sort-bar">
             {/*} <label className="search-sort-heading">Search Client</label>*/}

        <input
          type="text"
          placeholder="Search by name, description, or cost..."
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
          <option value="p_name">Project Name</option>
          <option value="description">Description</option>
          <option value="client_id">Client</option>
          <option value="cost">Cost</option>
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


      {/* Project Table */}
      {projects.length > 0 && (
        <div className="client-table">
          
          <br />
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Description</th>
                <th>Client</th>
                <th>Cost</th>
                <th>Last Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              (fetchProjects() && (<></>))
              {projects.map((proj, index) => (
                <tr key={index}>
                  <td>{proj.p_name}</td>
                  <td>{proj.description}</td>
                  <td>{clientMap[proj.client_id] || "Unknown Client"}</td>
                  <td>{proj.cost}</td>
                  <td>{proj.lastStatus || ""}</td>
                  <td>
                    <button onClick={() => handleUpdate(proj)}>Update</button>
                    <button onClick={() => handleDelete(proj.project_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Project;
