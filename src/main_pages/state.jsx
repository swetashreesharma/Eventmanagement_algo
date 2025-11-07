import "../Login.css";
import { useState } from "react";
import MainPage from "./mainpage";
function State() {
  const [columns, setColumns] = useState({}); 
  const [showForm, setShowForm] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [showItemForm, setShowItemForm] = useState(null); 
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  

  //  Add new column
  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    setColumns((prev) => ({ ...prev, [newColumnName]: [] }));
    setNewColumnName("");
    setShowForm(false);
  };

  //  Add new item to specific column
  const handleAddItem = (colName) => {
    if (!newItem.title.trim()) return;
    setColumns((prev) => ({
      ...prev,
      [colName]: [...prev[colName], { title: newItem.title, description: newItem.description }],
    }));
    setShowItemForm(null);
    setNewItem({ title: "", description: "" });
  };

  //  Handle drag start
  const handleDragStart = (e, colName, itemIndex) => {
    e.dataTransfer.setData("colName", colName);
    e.dataTransfer.setData("itemIndex", itemIndex);
  };

  //  Handle drop
const handleDrop = (e, targetCol) => {
  e.preventDefault();

  const sourceCol = e.dataTransfer.getData("colName");
  const itemIndex = parseInt(e.dataTransfer.getData("itemIndex"), 10);

  if (!sourceCol || sourceCol === targetCol) return;

  const itemToMove = columns[sourceCol][itemIndex];

  setColumns((prev) => {
    // deep copy of previous state
    const updated = { ...prev };

    // copy arrays to avoid direct mutation
    const sourceItems = [...updated[sourceCol]];
    const targetItems = [...updated[targetCol]];

    // remove from source
    sourceItems.splice(itemIndex, 1);

    // add to target
    targetItems.push(itemToMove);

    // update both
    updated[sourceCol] = sourceItems;
    updated[targetCol] = targetItems;

    return updated;
  });
};

  const allowDrop = (e) => e.preventDefault();

  return (
    <>
    <MainPage/>
    <div className="kanban-board">
      <button className="clientbutton" onClick={() => setShowForm(true)}>
        + Add State
      </button>

      {/* Add Column Popup */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h4>Add New State</h4>
            <form onSubmit={handleAddColumn}>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Enter State Name"
              />
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Popup */}
      {showItemForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="close-btn" onClick={() => setShowItemForm(null)}>×</button>
            <h4>Add Item to {showItemForm}</h4>
            <label>Title:</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Enter Title"
            />
            <label>Description:</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Enter Description"
              rows="3"
            ></textarea>
            <button onClick={() => handleAddItem(showItemForm)}>Add Item</button>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="kanban-container">
        {Object.keys(columns).map((col) => (
          <div
            key={col}
            className="kanban-column"
            onDrop={(e) => handleDrop(e, col)}
            onDragOver={allowDrop}
          >
            <h3>{col}</h3>
            <button className="add-item-btn" onClick={() => setShowItemForm(col)}>
              + Add Item
            </button>
            <div className="kanban-items">
              {columns[col].map((item, idx) => (
                <div
                  key={idx}
                  className="kanban-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, col, idx)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div></>
  );
}

export default State;
