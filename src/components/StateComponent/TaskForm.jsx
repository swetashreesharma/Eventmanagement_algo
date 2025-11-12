import React from "react";
import "../../style/Login.css"; // includes popup-overlay, popup-card styles

function TaskForm({
  show,
  selectedStateName,
  taskInputs,
  onChange,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h4>Add Task to "{selectedStateName}"</h4>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="task_name"
            value={taskInputs.task_name}
            onChange={onChange}
            placeholder="Enter Task Name"
          />
          <textarea
            name="description"
            value={taskInputs.description}
            onChange={onChange}
            placeholder="Enter Task Description"
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
