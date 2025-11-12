// src/components/Task/TaskEdit.jsx
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import "../../style/Login.css";
import { taskAPI } from "../../services/backendservices";
import Modal from "../modal";

function TaskEdit({ show, onClose, taskData, fetchStates }) {
  const [editTaskData, setEditTaskData] = useState(taskData);
  const [modalProps, setModalProps] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    setEditTaskData(taskData);
  }, [taskData]);

  if (!show) return null;

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editTaskData.task_name.trim()) {
      setModalProps({
        show: true,
        title: "Warning",
        message: "Task name required",
        type: "info",
      });
      return;
    }

    try {
      const res = await taskAPI.updateTask({
        task_id: editTaskData.task_id,
        task_name: editTaskData.task_name.trim(),
        description: editTaskData.description.trim(),
        current_state_id: editTaskData.current_state_id,
      });

      if (res?.data?.status) {
        setModalProps({
          show: true,
          title: "Update",
          message: "Do you want to Update Task?",
          type: "info",
         onConfirm: () => {
      setModalProps((prev) => ({ ...prev, show: false }));
      fetchStates();
      onClose();
    },
  });
      }
    } catch (err) {
      setModalProps({
        show: true,
        title: "Error",
        message: "Failed to update task",
        type: "info",
      });
    }
  };

  return createPortal(
    <>
      {/* Reusable feedback modal */}
      <Modal
        {...modalProps}
        onClose={() => setModalProps((prev) => ({ ...prev, show: false }))}
      />

      {/* Main Edit Popup */}
      <div className="popup-overlay">
        <div className="popup-card">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <h4>Edit Task</h4>
          <form onSubmit={handleUpdateTask}>
            <input
              type="text"
              placeholder="Enter task name"
              value={editTaskData.task_name || ""}
              onChange={(e) =>
                setEditTaskData({
                  ...editTaskData,
                  task_name: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Enter description"
              value={editTaskData.description || ""}
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
    </>,
    document.body
  );
}

export default TaskEdit;
