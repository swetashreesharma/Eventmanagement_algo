import React from "react";
import "../../style/Login.css";

function Table({ columns, data, loading, onUpdate, onDeleteClient,onDeleteProject, extraAction }) {
  return (
    <div className="client-table">
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>No Data records</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
               <td key={j} className="fixed-column" title={row[col.field]}>
  {col.isDate
    ? row[col.field]
      ? row[col.field].split("T")[0]
      : ""
    : row[col.field]}
</td>

                  ))}

                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {onUpdate && <button onClick={() => onUpdate(row)}>Edit</button>}
                      {onDeleteClient && (
                        <button onClick={() => onDeleteClient(row.client_id)}>
                          Delete
                        </button>
                      )}{onDeleteProject && (
                        <button onClick={() => onDeleteProject(row.project_id)}>
                          Delete
                        </button>
                      )}
                      {extraAction && extraAction(row)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
