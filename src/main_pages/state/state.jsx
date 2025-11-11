//import "../Login.css";
import "../../style/Login.css";

import { useState, useEffect } from "react";
//import MainPage from "../mainpage";
import { useLocation } from "react-router-dom";
import { stateAPI } from "../../services/backendservices";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

import { taskAPI } from "../../services/backendservices";

function State() {
  const location = useLocation();
  const project_id = location.state?.project_id;

  const [columns, setColumns] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({ state_id: null, state_name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showItemForm, setShowItemForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allStates, setAllStates] = useState([]);
  const [task, setTask] = useState([]);
  const [taskDescription, setTaskDescription] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [taskInputs, setTaskInputs] = useState({
    task_name: "",
    description: "",
  });
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    task_id: null,
    task_name: "",
    description: "",
    current_state_id: null,
  });

  useEffect(() => {
    if (!project_id) return;
    fetchStates();
  }, [project_id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleViewTask = async (task) => {
    setSelectedTask(task);
    setTaskDescription(true);
    try {
      const res = await taskAPI.getTaskHistoryById({ task_id: task.task_id });
      setTaskHistory(res.data.data || []);
    } catch (err) {
      console.log("Error fetching history:", err);
    }
  };
  /*async function fetchTaskHistory(){
    try{
        const res =await taskAPI.getTaskHistoryById(task_id);

        if(res?.data?.status){
          const data =res.data.data || [];
          if(data.length === 0){
          console.log("No task history found");
          }
          setTaskHistory(data);
        }else{
         console.log("getTaskHistory returned unexpected response:",res.data);
        setTaskHistory([]); 
}
    }catch(err){
    console.warn("Error fetching task history:",err?.response?.data || err.message);
    if(err?.response?.sataus !== 404){}
    }
   
  }

*/

  // Modify fetchStates to call it
  async function fetchStates() {
    try {
      setLoading(true);
      const res = await stateAPI.getAllStates({ project_id });
      if (res?.data?.status && Array.isArray(res.data.data)) {
        const states = [...res.data.data].sort(
          (a, b) => a.state_id - b.state_id
        );
        setAllStates(states);

        // Fetch all tasks
        const taskRes = await taskAPI.getAllTasks({ project_id });
        const allTasks = taskRes?.data?.data || [];

        // Build columns: key = state_name, value = tasks under this state
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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskInputs.task_name.trim()) return alert("Task name required");

    const selected = allStates.find((s) => s.state_name === showTaskForm);
    if (!selected) return alert("Invalid state");

    try {
      const res = await taskAPI.addTask({
        task_name: taskInputs.task_name.trim(),
        description: taskInputs.description.trim(),
        state_id: selected.state_id,
      });

      if (res?.data?.status) {
        alert("Task added successfully!");
        fetchStates(); // refresh states and tasks
        setShowTaskForm(null);
        setTaskInputs({ task_name: "", description: "" });
      } else {
        alert("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };
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
        //Remove the deleted state from local UI
        setColumns((prev) => {
          const updated = { ...prev };
          delete updated[colName];
          return updated;
        });

        // Also remove it from allStates to keep both in sync
        setAllStates((prev) =>
          prev.filter((s) => s.state_id !== selected.state_id)
        );

        alert("State deleted successfully");
      } else {
        alert("Failed to delete state");
      }
    } catch (err) {
      console.error("Delete state error:", err);
    }
  };

  const handleDragStart = (e, colName, itemIndex) => {
    e.dataTransfer.setData("colName", colName);
    e.dataTransfer.setData("itemIndex", itemIndex);
  };

  const handleDrop = async (e, targetCol) => {
    e.preventDefault();
    const sourceCol = e.dataTransfer.getData("colName");
    const itemIndex = parseInt(e.dataTransfer.getData("itemIndex"), 10);
    if (!sourceCol || sourceCol === targetCol) return;

    // Find the task being moved
    const itemToMove = columns[sourceCol][itemIndex];
    if (!itemToMove) return;

    // Update UI instantly for smooth experience
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

    // ---- BACKEND UPDATE ----
    try {
      // find the target state's ID
      const targetState = allStates.find((s) => s.state_name === targetCol);
      if (!targetState) return console.error("Target state not found");

      const payload = {
        task_id: itemToMove.task_id,
        task_name: itemToMove.task_name,
        description: itemToMove.description,
        current_state_id: targetState.state_id,
      };

      // call API to permanently move task
      const res = await taskAPI.updateTask(payload);

      if (res?.data?.status) {
        console.log(
          `Task "${itemToMove.task_name}" moved to state "${targetCol}" successfully`
        );
      } else {
        console.error("Failed to update task state:", res?.data?.msg);
        alert("Task move failed. Refresh to retry.");
        fetchStates(); // refresh state if failed
      }
    } catch (err) {
      console.error("Error updating task state on drag:", err);
      alert("Error updating task on drag.");
    }
  };

  const allowDrop = (e) => e.preventDefault();

  //delete
  const handleDeleteTask = async (task_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await taskAPI.deleteTask({ task_id });
      if (res?.data?.status) {
        alert("Task deleted successfully!");
        fetchStates(); // refresh list
      } else {
        alert(res?.data?.msg || "Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Error deleting task");
    }
  };
  //update
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTaskData.task_name.trim()) return alert("Task name required");

    try {
      const res = await taskAPI.updateTask({
        task_id: editTaskData.task_id,
        task_name: editTaskData.task_name.trim(),
        description: editTaskData.description.trim(),
        current_state_id: editTaskData.current_state_id,
      });

      if (res?.data?.status) {
        alert("Task updated successfully!");
        fetchStates();
        setShowEditTaskForm(false);
        setEditTaskData({
          task_id: null,
          task_name: "",
          description: "",
          current_state_id: null,
        });
      } else {
        alert(res?.data?.msg || "Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Error updating task");
    }
  };

  return (
    <>
      <MainPage />
      <br />
      <label className="heading">State List</label>
      <br />
      <button className="clientbutton" onClick={() => setShowForm(true)}>
        + Add State
      </button>
      <div className="kanban-board">
        {/* Add / Edit Form */}
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

        {/* Item Form */}
        {showTaskForm && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button
                className="close-btn"
                onClick={() => setShowTaskForm(null)}
              >
                ×
              </button>
              <h4>Add Task to {showTaskForm}</h4>
              <form onSubmit={handleAddTask}>
                <label>Task Name:</label>
                <input
                  type="text"
                  value={taskInputs.task_name}
                  onChange={(e) =>
                    setTaskInputs({ ...taskInputs, task_name: e.target.value })
                  }
                  placeholder="Enter task name"
                />
                <label>Description:</label>
                <textarea
                  value={taskInputs.description}
                  onChange={(e) =>
                    setTaskInputs({
                      ...taskInputs,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Enter task description"
                ></textarea>
                <button type="submit">Add Task</button>
              </form>
            </div>
          </div>
        )}
        {showEditTaskForm && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button
                className="close-btn"
                onClick={() => setShowEditTaskForm(false)}
              >
                ×
              </button>
              <h4>Edit Task</h4>
              <form onSubmit={handleUpdateTask}>
                <label>Task Name:</label>
                <input
                  type="text"
                  value={editTaskData.task_name}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      task_name: e.target.value,
                    })
                  }
                  placeholder="Enter new task name"
                />
                <label>Description:</label>
                <textarea
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="Enter new description"
                ></textarea>

                <button type="submit">Update Task</button>
              </form>
            </div>
          </div>
        )}

        {taskDescription && selectedTask && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button
                className="close-btn"
                onClick={() => setTaskDescription(false)}
              >
                ×
              </button>
              <h4>Task Info</h4>
              <form>
                <strong>
                  <label>Task Name:</label>
                </strong>
                <p id="history">{selectedTask.task_name}</p>
                <strong>
                  <label>Description:</label>
                </strong>
                <p id="history">{selectedTask.description}</p>
              </form>
              <div className="task-history">
                <h5>Task History</h5>
                {taskHistory.length > 0 ? (
                  <ul>
                    {taskHistory.map((item) => (
                      <li key={item.history_id}>
                        <p className="history-desc">{item.description}</p>
                        <small className="history-date">
                          {new Date(item.changed_at).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No history found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "white" }}>
            Loading states...
          </p>
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
                      <th>{col} </th>

                      <th>
                        <button
                          onClick={() => handleEditState(col)}
                          className="small-btn"
                        >
                          <FaPencilAlt />
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => handleDeleteState(col)}
                          className="small-btn"
                        >
                          <MdDelete />
                        </button>
                      </th>
                    </tr>
                  </thead>
                </table>
                <button
                  className="add-item-btn"
                  onClick={() => setShowTaskForm(col)}
                >
                  + Add Task
                </button>
                <div className="kanban-items">
                  {columns[col].map((item, idx) => (
                    <div
                      key={idx}
                      className="kanban-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, col, idx)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h3>
                            <div className="menu-container">
                              <strong>{item.task_name}</strong>

                              <button
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === item.task_id
                                      ? null
                                      : item.task_id
                                  )
                                }
                                className="menu-button"
                              >
                                <BsThreeDotsVertical />
                              </button>

                              {activeMenu === item.task_id && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "24px",
                                    right: "0",
                                    background: "white",
                                    borderRadius: "6px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    zIndex: 10,
                                    width: "100px",
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setEditTaskData({
                                        task_id: item.task_id,
                                        task_name: item.task_name,
                                        description: item.description,
                                        current_state_id: item.current_state_id,
                                      });
                                      setShowEditTaskForm(true);
                                      setActiveMenu(null);
                                    }}
                                    className="state-task-button"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteTask(item.task_id);
                                      setActiveMenu(null);
                                    }}
                                    className="state-task-button"
                                  >
                                    Delete
                                  </button>{" "}
                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      handleViewTask(item);
                                    }}
                                    className="state-task-button"
                                  >
                                    View
                                  </button>
                                </div>
                              )}
                            </div>
                          </h3>
                          <h6>{item.description}</h6>
                        </div>
                      </div>
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