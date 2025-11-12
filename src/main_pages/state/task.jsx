/*import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { taskAPI } from "../../services/backendservices";
import "../../style/Login.css";
import { createPortal } from "react-dom";
function Task({
  col,
  tasks,
  allStates,
  fetchStates,
  handleDragStart,
  setShowTaskForm,
  setTaskInputs,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [taskDescription, setTaskDescription] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);

  const [editTaskData, setEditTaskData] = useState({
    task_id: null,
    task_name: "",
    description: "",
    current_state_id: null,
  });

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

  const handleDeleteTask = async (task_id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await taskAPI.deleteTask({ task_id });
      if (res?.data?.status) {
        alert("Task deleted successfully!");
        fetchStates();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

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
        setShowEditTaskForm(false);
        fetchStates();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <>
      {taskDescription &&
        selectedTask &&
        createPortal(
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
          </div>,
          document.body
        )}

      <button
        className="add-item-btn"
        onClick={() => {
          setShowTaskForm(col);
          setTaskInputs({ task_name: "", description: "" });
        }}
      >
        + Add Task
      </button>

      <div className="kanban-items">
        {tasks.map((item, idx) => (
          <div
            key={idx}
            className="kanban-item"
            draggable
            onDragStart={(e) => handleDragStart(e, col, idx)}
          >
            <div className="menu-container">
              <strong>{item.task_name}</strong>

              <button
                onClick={() =>
                  setActiveMenu(
                    activeMenu === item.task_id ? null : item.task_id
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
                    boxShadow: "0 2px 6px rgba(4, 4, 4, 0.15)",
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
            <h6>{item.description}</h6>
          </div>
        ))}
      </div>

      {showEditTaskForm &&
        createPortal(
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
                <input
                  type="text"
                  value={editTaskData.task_name}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      task_name: e.target.value,
                    })
                  }
                />
                <textarea
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData({
                      ...editTaskData,
                      description: e.target.value,
                    })
                  }
                ></textarea>
                <button type="submit">Update</button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Task;
*/

import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { taskAPI } from "../../services/backendservices";
import "../../style/Login.css";
import Modal from "../../components/modal";
import { createPortal } from "react-dom";
import TaskEdit from "../../components/Task/TaskEdit";
import TaskDescription from "../../components/Task/TaskDescription";
import KanbanItem from "../../components/Task/KanbanItem";
function Task({
  col,
  tasks,
  allStates,
  fetchStates,
  handleDragStart,
  setShowTaskForm,
  setTaskInputs,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [taskDescription, setTaskDescription] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);

  const [editTaskData, setEditTaskData] = useState({
    task_id: null,
    task_name: "",
    description: "",
    current_state_id: null,
  });

  const [modalProps, setModalProps] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

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
      console.error("Error fetching history:", err);
    }
  };

  // Confirm Delete Modal
  const handleDeleteTask = (task) => {
    setModalProps({
      show: true,
      title: "Confirm Delete",
      message: `Are you sure you want to delete task "${task.task_name}"?`,
      type: "confirm",
      onConfirm: async () => {
        setModalProps((prev) => ({ ...prev, show: false })); // hide confirm modal
        try {
          const res = await taskAPI.deleteTask({ task_id: task.task_id });
          if (res?.data?.status) {
            setModalProps({
              show: true,
              title: "Success",
              message: "Task deleted successfully!",
              type: "info",
            });
                        fetchStates();

          }
        } catch (err) {
          setModalProps({
            show: true,
            title: "Error",
            message: "Failed to delete task",
            type: "info",
          });
        }
      },
    });
  };



  return (
    <>
      {/* Modal Component */}

          <Modal
  {...modalProps}
  onClose={() => setModalProps((prev) => ({ ...prev, show: false }))}
/>
  

  <TaskDescription
        show={taskDescription}
        onClose={() => setTaskDescription(false)}
        task={selectedTask}
        taskHistory={taskHistory}
      />

      <button
        className="add-item-btn"
        onClick={() => {
          setShowTaskForm(col);
          setTaskInputs({ task_name: "", description: "" });
        }}
      >
        + Add Task
      </button>

       <div className="kanban-items">
        {tasks.map((item, idx) => (
          <KanbanItem
            key={idx}
            item={item}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            handleEdit={(task) => {
              setEditTaskData(task);
              setShowEditTaskForm(true);
              setActiveMenu(null);
            }}
            handleDelete={handleDeleteTask}
            handleView={handleViewTask}
            handleDragStart={handleDragStart}
            col={col}
            idx={idx}
          />
        ))}
      </div>

      {/* Edit Task Popup */}
     <TaskEdit
  show={showEditTaskForm}
  onClose={() => setShowEditTaskForm(false)}
  taskData={editTaskData}
  fetchStates={fetchStates}
/>

    </>
  );
}

export default Task;

