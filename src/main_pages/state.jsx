import "../Login.css";
import { useState, useEffect } from "react";
import MainPage from "./mainpage";
import { useLocation } from "react-router-dom";
import { stateAPI } from "../services/backendservices";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

function State() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [columns, setColumns] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({ state_id: null, state_name: "" }); // ✅ added
  const [isEditing, setIsEditing] = useState(false);
  const [showItemForm, setShowItemForm] = useState(null);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [allStates, setAllStates] = useState([]); // ✅ keep full data with ids

  useEffect(() => {
    if (!project_id) return;
    fetchStates();
  }, [project_id]);

  async function fetchStates() {
    try {
      setLoading(true);
      const res = await stateAPI.getAllStates({ project_id });
      if (res?.data?.status && Array.isArray(res.data.data)) {
        const data = res.data.data;
        setAllStates(data); // ✅ store id + name
        const formatted = {};
        data.forEach((state) => {
          formatted[state.state_name] = [];
        });
        setColumns(formatted);
      } else {
        console.warn("Unexpected response:", res?.data);
      }
    } catch (err) {
      console.error("Error fetching states:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Add or Update State
  const handleAddOrUpdateState = async (e) => {
    e.preventDefault();
    if (!inputs.state_name.trim()) return;

    try {
      if (isEditing) {
        // --- UPDATE ---
        const payload = {
          state_id: inputs.state_id,
          state_name: inputs.state_name.trim(),
        };
        console.log("Updating state:", payload);

        const res = await stateAPI.updateState(payload);
        if (res?.data?.status) {
          alert("State updated successfully");
          fetchStates();
          setInputs({ state_id: null, state_name: "" });
          setIsEditing(false);
          setShowForm(false);
        } else {
          alert("Failed to update state");
        }
      } else {
        // --- ADD NEW ---
        const res = await stateAPI.addState({
          state_name: inputs.state_name.trim(),
          project_id,
        });
        if (res?.data?.status) {
          alert("State added successfully");
          fetchStates();
          setInputs({ state_id: null, state_name: "" });
          setShowForm(false);
        } else {
          alert("Failed to add state");
        }
      }
    } catch (err) {
      console.error("Add/Update state error:", err);
    }
  };

  // ✅ Edit handler (sets input)
  const handleEditState = (stateName) => {
    const selected = allStates.find((s) => s.state_name === stateName);
    if (!selected) {
      alert("State not found!");
      return;
    }
    setInputs({ state_id: selected.state_id, state_name: selected.state_name });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteState = async (colName) => {
    const confirmDelete = window.confirm(`Delete state "${colName}"?`);
    if (!confirmDelete) return;

    try {
      const selected = allStates.find((s) => s.state_name === colName);
      if (!selected) {
        alert("State not found");
        return;
      }

      const res = await stateAPI.deleteState({ state_id: selected.state_id });
      if (res?.data?.status) {
        const updated = { ...columns };
        delete updated[colName];
        setColumns(updated);
        fetchStates();
      } else {
        alert("Failed to delete state");
      }
    } catch (err) {
      console.error("Delete state error:", err);
    }
  };

  const handleAddItem = (colName) => {
    if (!newItem.title.trim()) return;
    setColumns((prev) => ({
      ...prev,
      [colName]: [...prev[colName], { title: newItem.title, description: newItem.description }],
    }));
    setShowItemForm(null);
    setNewItem({ title: "", description: "" });
  };

  const handleDragStart = (e, colName, itemIndex) => {
    e.dataTransfer.setData("colName", colName);
    e.dataTransfer.setData("itemIndex", itemIndex);
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    const sourceCol = e.dataTransfer.getData("colName");
    const itemIndex = parseInt(e.dataTransfer.getData("itemIndex"), 10);
    if (!sourceCol || sourceCol === targetCol) return;
    const itemToMove = columns[sourceCol][itemIndex];

    setColumns((prev) => {
      const updated = { ...prev };
      const sourceItems = [...updated[sourceCol]];
      const targetItems = [...updated[targetCol]];
      sourceItems.splice(itemIndex, 1);
      targetItems.push(itemToMove);
      updated[sourceCol] = sourceItems;
      updated[targetCol] = targetItems;
      return updated;
    });
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <>
      <MainPage />
      <div className="kanban-board">
        <button className="clientbutton" onClick={() => setShowForm(true)}>
          + Add State
        </button>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button className="close-btn" onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setInputs({ state_id: null, state_name: "" });
              }}>×</button>
              <h4>{isEditing ? "Edit State" : "Add New State"}</h4>
              <form onSubmit={handleAddOrUpdateState}>
                <input
                  type="text"
                  value={inputs.state_name}
                  onChange={(e) => setInputs({ ...inputs, state_name: e.target.value })}
                  placeholder="Enter State Name"
                />
                <button type="submit">{isEditing ? "Update" : "Add"}</button>
              </form>
            </div>
          </div>
        )}

        {/* Item Form */}
        {showItemForm && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button className="close-btn" onClick={() => setShowItemForm(null)}>×</button>
              <h4>Add Item to {showItemForm}</h4>
              <label>Title:</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter Title"
              />
              <label>Description:</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter Description"
                rows="3"
              ></textarea>
              <button onClick={() => handleAddItem(showItemForm)}>Add Item</button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "white" }}>Loading states...</p>
        ) : (
          <div className="kanban-container">
            {Object.keys(columns).map((col) => (
              <div
                key={col}
                className="kanban-column"
                onDrop={(e) => handleDrop(e, col)}
                onDragOver={allowDrop}
              >
                <table>
                    <tr>
                  <th>
                  {col}{" "}</th>
                
                    <th>
                  <button onClick={() => handleEditState(col)} className="small-btn">
                    <FaPencilAlt />
                  </button></th><th>
                  <button onClick={() => handleDeleteState(col)} className="small-btn">
                    <MdDelete />
                  </button></th>
                  </tr>
                </table>
                <button className="add-item-btn" onClick={() => setShowItemForm(col)}>
                  + Add Item
                </button>
                <div className="kanban-items">
                  {columns[col].map((item, idx) => (
                    <div
                      key={idx}
                      className="kanban-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, col, idx)}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default State;
