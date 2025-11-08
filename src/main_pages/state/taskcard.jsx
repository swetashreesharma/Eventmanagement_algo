// src/components/State/TaskCard.jsx
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { taskAPI } from "../../services/backendservices";

function TaskCard({ col, tasks, allStates, fetchStatesAndTasks }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInputs, setTaskInputs] = useState({ task_name: "", description: "" });
  const [editTaskData, setEditTaskData] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // ✅ Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const selected = allStates.find((s) => s.state_name === col);
    const res = await taskAPI.addTask({
      task_name: taskInputs.task_name,
      description: taskInputs.description,
      state_id: selected.state_id,
    });
    if (res?.data?.status) {
      alert("Task added!");
      setShowTaskForm(false);
      setTaskInputs({ task_name: "", description: "" });
      fetchStatesAndTasks();
    }
  };

  // ✅ Update Task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const res = await taskAPI.updateTask(editTaskData);
    if (res?.data?.status) {
      alert("Updated!");
      setEditTaskData(null);
      fetchStatesAndTasks();
    }
  };

  // ✅ Delete Task
  const handleDeleteTask = async (task_id) => {
    const res = await taskAPI.deleteTask({ task_id });
    if (res?.data?.status) {
      alert("Deleted!");
      fetchStatesAndTasks();
    }
  };

  return (
    <div className="task-section">
      <button onClick={() => setShowTaskForm(true)}>+ Add Task</button>

      {showTaskForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowTaskForm(false)}>
              ×
            </button>
            <h4>Add Task to {col}</h4>
            <form onSubmit={handleAddTask}>
              <input
                value={taskInputs.task_name}
                onChange={(e) =>
                  setTaskInputs({ ...taskInputs, task_name: e.target.value })
                }
                placeholder="Task name"
              />
              <textarea
                value={taskInputs.description}
                onChange={(e) =>
                  setTaskInputs({ ...taskInputs, description: e.target.value })
                }
                placeholder="Description"
              ></textarea>
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      )}

      {tasks.map((t, i) => (
        <div key={i} className="kanban-item">
          <strong>{t.task_name}</strong>
          <p>{t.description}</p>

          <button
            style={{ background: "none", border: "none" }}
            onClick={() =>
              setActiveMenu(activeMenu === t.task_id ? null : t.task_id)
            }
          >
            <BsThreeDotsVertical />
          </button>

          {activeMenu === t.task_id && (
            <div className="menu-popup">
              <button onClick={() => setEditTaskData(t)}>Edit</button>
              <button onClick={() => handleDeleteTask(t.task_id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      {editTaskData && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button
              className="close-btn"
              onClick={() => setEditTaskData(null)}
            >
              ×
            </button>
            <h4>Edit Task</h4>
            <form onSubmit={handleUpdateTask}>
              <input
                value={editTaskData.task_name}
                onChange={(e) =>
                  setEditTaskData({ ...editTaskData, task_name: e.target.value })
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
        </div>
      )}
    </div>
  );
}

export default TaskCard;
