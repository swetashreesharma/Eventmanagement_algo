import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Task from "../../main_pages/state/task";
import "../../style/Login.css";

function KanbanColumn({
  colName,
  tasks,
  allStates,
  fetchStates,
  handleDragStart,
  handleDrop,
  handleEditState,
  handleDeleteState,
  allowDrop,
  openTaskForm,
}) {
  return (
    <div
      className="kanban-column"
      onDrop={(e) => handleDrop(e, colName)}
      onDragOver={allowDrop}
    >
      <table>
        <thead>
          <tr>
            <th>{colName}</th>
            <th>
              <button
                onClick={() => handleEditState(colName)}
                className="small-btn"
              >
                <FaPencilAlt />
              </button>
            </th>
            <th>
              <button
                onClick={() => handleDeleteState(colName)}
                className="small-btn"
              >
                <MdDelete />
              </button>
            </th>
          </tr>
        </thead>
      </table>

      <Task
        col={colName}
        tasks={tasks}
        allStates={allStates}
        fetchStates={fetchStates}
        handleDragStart={handleDragStart}
        setShowTaskForm={openTaskForm}
      />
    </div>
  );
}

export default KanbanColumn;
