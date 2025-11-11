import "../../style/Login.css";
import { useState, useEffect } from "react";
//import MainPage from "../sidebar.jsx";
import { useLocation } from "react-router-dom";
import { stateAPI, taskAPI } from "../../services/backendservices";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Task from "./task";
import Modal from "../../components/modal.jsx"; // import your modal component

function State() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [columns, setColumns] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({ state_id: null, state_name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allStates, setAllStates] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInputs, setTaskInputs] = useState({ task_name: "", description: "" });
  const [selectedStateName, setSelectedStateName] = useState(null);

  // MODAL STATES
  const [modalProps, setModalProps] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    if (project_id) fetchStates();
  }, [project_id]);

  async function fetchStates() {
    try {
      setLoading(true);
      const res = await stateAPI.getAllStates({ project_id });
      if (res?.data?.status && Array.isArray(res.data.data)) {
        const states = [...res.data.data].sort((a, b) => a.state_id - b.state_id);
        setAllStates(states);

        const taskRes = await taskAPI.getAllTasks({ project_id });
        const allTasks = taskRes?.data?.data || [];

        const columnsObj = {};
        states.forEach((s) => {
          columnsObj[s.state_name] = allTasks.filter(
            (t) => t.current_state_id === s.state_id
          );
        });
        setColumns(columnsObj);
      }
    } catch (err) {
      console.error("Error fetching states/tasks:", err);
    } finally {
      setLoading(false);
    }
  }

  // Add or update state
  const handleAddOrUpdateState = async (e) => {
    e.preventDefault();
    if (!inputs.state_name.trim()) {
      return setModalProps({
        show: true,
        title: "Validation",
        message: "Enter state name",
        type: "info",
        onConfirm: null,
      });
    }

    try {
      if (isEditing) {
        const res = await stateAPI.updateState({
          state_id: inputs.state_id,
          state_name: inputs.state_name.trim(),
        });
        if (res?.data?.status) {
          setModalProps({
            show: true,
            title: "Success",
            message: "State updated successfully",
            type: "info",
          });
        }
      } else {
        const res = await stateAPI.addState({
          state_name: inputs.state_name.trim(),
          project_id,
        });
        if (res?.data?.status) {
          setModalProps({
            show: true,
            title: "Success",
            message: "State added successfully",
            type: "info",
          });
        }
      }
      fetchStates();
      setShowForm(false);
      setInputs({ state_id: null, state_name: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Add/Update state error:", err);
    }
  };

  const handleEditState = (colName) => {
    const selected = allStates.find((s) => s.state_name === colName);
    if (!selected) {
      return setModalProps({
        show: true,
        title: "Error",
        message: "State not found",
        type: "info",
      });
    }
    setInputs(selected);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteState = (colName) => {
    const selected = allStates.find((s) => s.state_name === colName);
    if (!selected) {
      return setModalProps({
        show: true,
        title: "Error",
        message: "State not found",
        type: "info",
      });
    }

    setModalProps({
      show: true,
      title: "Confirm",
      message: `Delete state "${colName}"?`,
      type: "confirm",
      onConfirm: async () => {
        try {
          const res = await stateAPI.deleteState({ state_id: selected.state_id });
          if (res?.data?.status) {
            fetchStates();
          }
        } catch (err) {
          console.error("Delete state error:", err);
        } finally {
          setModalProps((prev) => ({ ...prev, show: false }));
        }
      },
    });
  };

  const handleDragStart = (e, colName, itemIndex) => {
    e.dataTransfer.setData("colName", colName);
    e.dataTransfer.setData("itemIndex", itemIndex);
  };
  const allowDrop = (e) => e.preventDefault();

  const handleDrop = async (e, targetCol) => {
    e.preventDefault();
    const sourceCol = e.dataTransfer.getData("colName");
    const itemIndex = parseInt(e.dataTransfer.getData("itemIndex"), 10);
    if (!sourceCol || sourceCol === targetCol) return;

    const itemToMove = columns[sourceCol][itemIndex];
    if (!itemToMove) return;

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

    try {
      const targetState = allStates.find((s) => s.state_name === targetCol);
      if (!targetState) throw new Error("Target state not found");
      await taskAPI.updateTask({
        task_id: itemToMove.task_id,
        task_name: itemToMove.task_name,
        description: itemToMove.description,
        current_state_id: targetState.state_id,
      });
    } catch (err) {
      console.error("Error updating task:", err);
      setModalProps({
        show: true,
        title: "Error",
        message: "Error updating task on drag.",
        type: "info",
      });
      fetchStates();
    }
  };

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskInputs.task_name.trim()) {
      return setModalProps({
        show: true,
        title: "Validation",
        message: "Task name required",
        type: "info",
      });
    }

    const selected = allStates.find((s) => s.state_name === selectedStateName);
    if (!selected) {
      return setModalProps({
        show: true,
        title: "Error",
        message: "Invalid state",
        type: "info",
      });
    }

    try {
      const res = await taskAPI.addTask({
        task_name: taskInputs.task_name.trim(),
        description: taskInputs.description.trim(),
        state_id: selected.state_id,
      });

      if (res?.data?.status) {
        fetchStates();
        setShowTaskForm(false);
        setTaskInputs({ task_name: "", description: "" });
      } else {
        setModalProps({
          show: true,
          title: "Error",
          message: res?.data?.msg || "Failed to add task",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInputs({ ...taskInputs, [name]: value });
  };

  return (
    <>

      {/* MODAL */}
      <Modal
        {...modalProps}
        onClose={() => setModalProps((prev) => ({ ...prev, show: false }))}
      />

      {/* ADD TASK MODAL */}
      {showTaskForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button
              className="close-btn"
              onClick={() => {
                setShowTaskForm(false);
                setTaskInputs({ task_name: "", description: "" });
              }}
            >
              ×
            </button>
            <h4>Add Task to "{selectedStateName}"</h4>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                name="task_name"
                value={taskInputs.task_name}
                onChange={handleTaskInputChange}
                placeholder="Enter Task Name"
              />
              <textarea
                name="description"
                value={taskInputs.description}
                onChange={handleTaskInputChange}
                placeholder="Enter Task Description"
              />
              <button type="submit">Add Task</button>
            </form>
          </div>
        </div>
      )}

      <br />
      <label className="heading">State List</label>
      <br />
      <button className="clientbutton" onClick={() => setShowForm(true)}>
        + Add State
      </button>

      {/* STATE MODAL */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button
              className="close-btn"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setInputs({ state_id: null, state_name: "" });
              }}
            >
              ×
            </button>
            <h4>{isEditing ? "Edit State" : "Add New State"}</h4>
            <form onSubmit={handleAddOrUpdateState}>
              <input
                type="text"
                value={inputs.state_name}
                onChange={(e) =>
                  setInputs({ ...inputs, state_name: e.target.value })
                }
                placeholder="Enter State Name"
              />
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          </div>
        </div>
      )}

      {/* KANBAN BOARD */}
      {loading ? (
        <p style={{ textAlign: "center", color: "white" }}>Loading...</p>
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
                <thead>
                  <tr>
                    <th>{col}</th>
                    <th>
                      <button onClick={() => handleEditState(col)} className="small-btn">
                        <FaPencilAlt />
                      </button>
                    </th>
                    <th>
                      <button onClick={() => handleDeleteState(col)} className="small-btn">
                        <MdDelete />
                      </button>
                    </th>
                  </tr>
                </thead>
              </table>

              <Task
                col={col}
                tasks={columns[col]}
                allStates={allStates}
                fetchStates={fetchStates}
                handleDragStart={handleDragStart}
                setShowTaskForm={(colName) => {
                  setSelectedStateName(colName);
                  setShowTaskForm(true);
                  setTaskInputs({ task_name: "", description: "" });
                }}
                setTaskInputs={setTaskInputs}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default State;
