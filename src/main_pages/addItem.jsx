/*import "../Login.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itemAPI } from "../services/backendservices"; // new API service

function AddItem() {
  const { state_id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.title.trim()) return alert("Please enter a title");

    try {
      setLoading(true);
      const res = await itemAPI.addItem({
        state_id,
        title: inputs.title.trim(),
        description: inputs.description.trim(),
      });

      if (res?.data?.status) {
        alert("Item added successfully!");
        navigate(-1); // go back to state page
      } else {
        alert("Failed to add item");
      }
    } catch (err) {
      console.error("Add item error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h4>Add New Item</h4>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleChange}
            placeholder="Enter title"
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
            {loading ? "Saving..." : "Add Item"}
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

export default AddItem;
*/