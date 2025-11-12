import { BsThreeDotsVertical } from "react-icons/bs";

function KanbanItem({
  item,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleDelete,
  handleView,
  handleDragStart,
  col,
  idx,
}) {
  return (<>
    <div
      className="kanban-item"
      draggable
      onDragStart={(e) => handleDragStart(e, col, idx)}
    >
        <h3>
      <div className="menu-container">
        <strong>{item.task_name}</strong>

        <button
          onClick={() =>
            setActiveMenu(activeMenu === item.task_id ? null : item.task_id)
          }
          className="menu-button"
        >
          <BsThreeDotsVertical />
        </button>

        {activeMenu === item.task_id && (
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: 0,
              background: "white",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 10,
              width: "110px",
            }}
          >
            <button className="state-task-button" onClick={() => handleEdit(item)}>
              Edit
            </button>
            <button className="state-task-button" onClick={() => handleDelete(item)}>
              Delete
            </button>
            <button className="state-task-button" onClick={() => handleView(item)}>
              View
            </button>
          </div>
        )}
      </div>    </h3>

      <h6>{item.description}</h6>
    </div>
    
    </>
  );
}

export default KanbanItem;
