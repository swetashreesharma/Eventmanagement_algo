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
