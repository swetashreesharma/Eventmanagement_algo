import "../style/Login.css";

import { useState, useEffect } from "react";
import PrimaryCities from "../assests/cities.json";

import { clientAPI, projectAPI } from "../services/backendservices.js";
import Modal from "../components/modal.jsx";
import Table from "../components/Table/table.jsx";
import SearchSortBar from "../components/SearchSortBar.jsx";
import useSearchSort from "../hooks/useSearchSort.jsx";
import PopupForm from "../components/Form/PopUpForm.jsx";
import ProjectsDropdown from "../components/Project/ProjectDropdown.jsx";
import { useNavigate } from "react-router-dom";
function Client() {
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [projects, setprojects] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const cities = PrimaryCities.reduce((acc, item) => {
    if (!acc[item.state]) acc[item.state] = [];
    acc[item.state].push(item.name);
    return acc;
  }, {});
  const toggleModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });

    // keep modal visible for 2 seconds before auto-closing
    setTimeout(() => {
      setModal((prev) => ({ ...prev, show: false }));
    }, 2000);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients().catch((err) => {
      if (err.response?.status === 401) {
        toggleModal("Session Expired", "Please login again.", "error");
      }
    });
    fetchProjects();
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
      toggleModal("Error", "Failed to fetch clients.", "error");
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
        toggleModal("Success", res.data.msg, "success");
        setInputs({});
        setShowForm(false);
        fetchClients();
      } else {
        alert(res?.data?.error || "Operation failed");
      }
    } catch (err) {
      console.error("Client submit error:", err);
      toggleModal("Error", "Error submitting client. See console.", "error");
    }
  }

  async function handleDelete(clientId) {
    setModal({
      show: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete this client?",
      type: "warning",
      onConfirm: async () => {
        try {
          const res = await clientAPI.deleteClient({ client_id: clientId });
          if (res?.data?.status) {
            toggleModal("Success", "Client deleted successfully", "success");
            setClients((prev) => prev.filter((c) => c.client_id !== clientId));
          } else {
            alert(res?.data?.error || "Failed to delete client");
          }
        } catch (err) {
          console.error("Delete client error:", err);
          toggleModal("Error", "Error deleting client. See console.", "error");
        }
      },
    });
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
  const sortedClients = useSearchSort(
    clients,
    searchTerm,
    sortOption,
    sortDirection,
    ["f_name", "l_name", "email", "city_name"] // searchable fields
  );

  async function fetchProjects() {
    try {
      const res = await projectAPI.getAllProjects();
      if (res?.data?.status) {
        setprojects(res.data.data || []);
      } else {
        setprojects([]);
      }
    } catch (err) {
      console.warn(
        "Error fetching projects:",
        err?.response?.data || err.message
      );
    }
  }

  const projectMap = projects.reduce((acc, p) => {
    if (!acc[p.client_id]) acc[p.client_id] = [];
    acc[p.client_id].push(p.p_name);
    return acc;
  }, {});
  const clientsWithProjects = sortedClients.map((c) => ({
    ...c,
    Project: (
      <ProjectsDropdown
        projects={projects.filter((p) => p.client_id === c.client_id)}
      />
    ),
  }));

  return (
    <>
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
        <PopupForm
          title="Client"
          formMode={formMode}
          inputs={inputs}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          fields={[
            {
              label: "First Name:",
              name: "f_name",
              type: "text",
              placeholder: "First name",
            },
            {
              label: "Last Name:",
              name: "l_name",
              type: "text",
              placeholder: "Last name (optional)",
            },
            {
              label: "Email:",
              name: "email",
              type: "text",
              placeholder: "Email",
              disabled: formMode === "update",
            },
            { label: "Date Of Birth:", name: "dob", type: "date" },
            {
              label: "Gender:",
              name: "gender",
              type: "radio",
              options: [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ],
            },
            {
              label: "State:",
              name: "state",
              type: "select",
              placeholder: "Select State",
              options: Object.keys(cities).map((s) => ({ label: s, value: s })),
            },
            ...(inputs.state
              ? [
                  {
                    label: "City:",
                    name: "city_name",
                    type: "select",
                    placeholder: "Select City",
                    options: cities[inputs.state]?.map((c) => ({
                      label: c,
                      value: c,
                    })),
                  },
                ]
              : []),
            {
              label: "Number:",
              name: "phone",
              type: "text",
              placeholder: "10-digit phone",
            },
            { label: "Note:", name: "note", type: "textarea", rows: 3 },
          ]}
        />
      )}

      {/* Table showing clients */}

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        searchPlaceholder="Search by name, email, or city..."
        sortOptions={[
          { value: "f_name", label: "First Name" },
          { value: "l_name", label: "Last Name" },
          { value: "email", label: "Email" },
          { value: "dob", label: "Date of Birth" },
        ]}
      />

      <Table
        columns={[
          { header: "First", field: "f_name" },
          { header: "Last", field: "l_name" },
          { header: "Email", field: "email" },
          { header: "DOB", field: "dob", isDate: true },
          { header: "Gender", field: "gender" },
          { header: "State", field: "state_name" },
          { header: "City", field: "city_name" },
          { header: "Phone", field: "phone" },
          { header: "Note", field: "note", isNote: true },
          { header: "projects", field: "Project" },
        ]}
        data={clientsWithProjects}
        loading={loading}
        onUpdate={handleUpdate}
        onDeleteClient={handleDelete}
        extraAction={(client) => (
          <button
            className="view-btn"
            onClick={() =>
              navigate("/projects", {
                state: {
                  client_id: client.client_id,
                  client_name: `${client.f_name} ${client.l_name}`,
                },
              })
            }
          >
            View
          </button>
        )}
      />
      <Modal
        show={modal.show}
        onClose={() => setModal({ ...modal, show: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </>
  );
}

export default Client;
