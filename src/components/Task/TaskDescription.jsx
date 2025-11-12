import { createPortal } from "react-dom";
import "../../style/Login.css";

function TaskDescription({ show, onClose, task, taskHistory }) {
  if (!show || !task) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h4>Task Info</h4>

        <form>
          <strong><label>Task Name:</label></strong>
          <p>{task.task_name}</p>

          <strong><label>Description:</label></strong>
          <p>{task.description}</p>
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
  );
}

export default TaskDescription;
