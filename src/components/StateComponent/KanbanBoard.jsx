import React from "react";
import KanbanColumn from "./KanbanColumns";
import "../../style/Login.css";

function KanbanBoard({
  loading,
  columns,
  allStates,
  fetchStates,
  handleDragStart,
  handleDrop,
  handleEditState,
  handleDeleteState,
  allowDrop,
  openTaskForm,
}) {
  if (loading) {
    return <p style={{ textAlign: "center", color: "white" }}>Loading...</p>;
  }

  return (
    <div className="kanban-container">
      {Object.keys(columns).map((col) => (
        <KanbanColumn
          key={col}
          colName={col}
          tasks={columns[col]}
          allStates={allStates}
          fetchStates={fetchStates}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          handleEditState={handleEditState}
          handleDeleteState={handleDeleteState}
          allowDrop={allowDrop}
          openTaskForm={(colName) => openTaskForm(colName)}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;
