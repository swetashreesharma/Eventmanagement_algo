import "../style/Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { clientAPI, projectAPI } from "../services/backendservices";
import { useNavigate } from "react-router-dom";
import Modal from "../components/modal.jsx"; // import modal
import Table from "../components/Table/table.jsx";
import SearchSortBar from "../components/SearchSortBar.jsx";
import useSearchSort from "../hooks/useSearchSort.jsx";
import PopupForm from "../components/Form/PopUpForm.jsx";
import { useLocation } from "react-router-dom";

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
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
    onConfirm: null,
  }); // modal state

  const navigate = useNavigate();
  const location = useLocation();
  const clientIdFromClientPage = location.state?.client_id || null;
  const clientNameFromClientPage = location.state?.client_name || "";

  const toggleModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ show: true, title, message, type, onConfirm });
  };

  const closeModal = () => {
    setModal({
      show: false,
      title: "",
      message: "",
      type: "",
      onConfirm: null,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://192.168.1.17:5000/api/clients/getallclients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data.data || []))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  useEffect(() => {
    fetchProjects().catch((err) => {
      if (err.response?.status === 401) {
        toggleModal("Session Expired", "Please log in again", "warning");
      }
    });
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await projectAPI.getAllProjects();
      if (res?.data?.status) {
        let allProjects = res.data.data || [];

        //  Filter if we came from a specific client
        if (clientIdFromClientPage) {
          allProjects = allProjects.filter(
            (p) => p.client_id === clientIdFromClientPage
          );
        }

        setProjects(allProjects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.warn(
        "Error fetching projects:",
        err?.response?.data || err.message
      );
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
    if (!values.name || values.name.trim().length < 3)
      newErrors.name = "Project name must be at least 3 characters long.";
    if (!values.note || values.note.trim().length < 5)
      newErrors.note = "Description must be at least 5 characters long.";
    if (!values.client && !clientIdFromClientPage)
      newErrors.client = "Please select a client.";
    if (!values.cost) newErrors.cost = "Cost is required.";
    else if (isNaN(values.cost)) newErrors.cost = "Cost must be a number.";
    else if (Number(values.cost) <= 0)
      newErrors.cost = "Cost must be greater than zero.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(inputs);
    if (Object.keys(validationErrors).length)
      return setErrors(validationErrors);

    const payload = {
      project_id: inputs.project_id,
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
        setInputs({});
        setShowForm(false);
        fetchProjects();
        toggleModal(
          "Success",
          formMode === "update"
            ? "Project updated successfully!"
            : "Project added successfully!",
          "success"
        );
      } else {
        toggleModal("Error", res?.data?.error || "Operation failed", "error");
      }
    } catch (err) {
      console.error("Project submit error:", err);
      toggleModal("Error", "Error submitting project", "error");
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

  function handleDelete(project_id) {
    toggleModal(
      "Confirm Delete",
      `Are you sure you want to delete project (${project_id})?`,
      "warning",
      async () => {
        try {
          const res = await projectAPI.deleteProject({ project_id });
          if (res?.data?.status) {
            setProjects((prev) =>
              prev.filter((p) => p.project_id !== project_id)
            );
            toggleModal("Success", "Project deleted successfully!", "success");
          } else {
            toggleModal(
              "Error",
              res?.data?.error || "Failed to delete",
              "error"
            );
          }
        } catch (err) {
          console.error("Delete project error:", err);
          toggleModal("Error", "Error deleting project", "error");
        }
      }
    );
  }

  // Filter + Sort Projects
  const sortedProjects = useSearchSort(
    projects,
    searchTerm,
    sortOption,
    sortDirection,
    ["p_name", "description", "full_name", "cost"] // searchable fields
  );

  return (
    <>
      <br />
      {clientIdFromClientPage && (
        <button className="clientbutton" onClick={() => navigate("/client")}>
          ← Back to Clients
        </button>
      )}
      <br />
      <label className="heading">
        {clientIdFromClientPage
          ? `Projects for ${clientNameFromClientPage} `
          : "All Projects"}
      </label>
      <br />

      <button
        className="clientbutton"
        onClick={() => {
          setInputs((prev) => ({
            ...prev,
            client: clientIdFromClientPage || "", // prefill
          }));
          setFormMode("add");
          setShowForm(true);
        }}
      >
        Add Project +
      </button>

      {showForm && (
        <PopupForm
          title="Project"
          formMode={formMode}
          inputs={inputs}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          fields={[
            {
              label: "Project Name:",
              name: "name",
              type: "text",
              placeholder: "Enter Project Name",
            },
            {
              label: "Note:",
              name: "note",
              type: "textarea",
              placeholder: "Enter project description",
              rows: 2,
            },
            {
              label: "Client:",
              name: "client",
              type: "select",
              placeholder: "Select Client",
              disabled: !!clientIdFromClientPage || formMode === "update",
              options: clients.map((c) => ({
                value: c.client_id,
                label: `${c.f_name} ${c.l_name} – ${c.city_name}`,
              })),
              defaultValue: clientIdFromClientPage || "",
            },
            {
              label: "Cost:",
              name: "cost",
              type: "text",
              placeholder: "Enter Cost",
            },
          ]}
        />
      )}

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        searchPlaceholder="Search by name, description, or cost..."
        sortOptions={[
          { value: "p_name", label: "Project Name" },
          { value: "description", label: "Description" },
          { value: "full_name", label: "Client" },
          { value: "cost", label: "Cost" },
        ]}
      />

      {/*  
      {loading ? (
        <p>Loading projects...</p>
      ) : sortedProjects.length > 0 ? (*/}
      <Table
        columns={[
          { header: "Project Name", field: "p_name" },
          { header: "Description", field: "description", isNote: true },
          { header: "Client", field: "full_name" },
          { header: "Cost", field: "cost" },
          { header: "Last Status", field: "last_action" },
        ]}
        data={sortedProjects}
        loading={loading}
        onUpdate={handleUpdate}
        onDeleteProject={handleDelete}
        extraAction={(proj) => (
          <button
            onClick={() =>
              navigate("/state", {
                state: { project_id: proj.project_id, p_name: proj.p_name },
              })
            }
          >
            View
          </button>
        )}
      />

      {/*} ) : (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "white",
            fontWeight: "bolder",
          }}
        >
          No projects available.
        </p>
      )}
*/}
      {/*  Modal Integration */}
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </>
  );
}

export default Project;
