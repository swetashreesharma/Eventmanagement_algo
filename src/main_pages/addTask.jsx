//import "../Login.css";
import "../style/Login.css";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { taskAPI } from "../services/backendservices";

function AddTask() {
  const { state_id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ task_name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.task_name.trim()) return alert("Task name is required");

    try {
      setLoading(true);
      const res = await taskAPI.addTask({
        task_name: inputs.task_name.trim(),
        description: inputs.description.trim(),
        state_id: parseInt(state_id),
      });

      if (res?.data?.status) {
        alert("Task added successfully!");
        navigate(-1); // go back to State page
      } else {
        alert("Failed to add task");
      }
    } catch (err) {
      console.error("Add task error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h4>Add New Task</h4>
        <form onSubmit={handleSubmit}>
          <label>Task Name:</label>
          <input
            type="text"
            name="task_name"
            value={inputs.task_name}
            onChange={handleChange}
            placeholder="Enter task name"
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={inputs.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter description"
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Task"}
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
