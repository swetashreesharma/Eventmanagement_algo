import { useNavigate } from "react-router-dom";

function ProjectsDropdown({ projects }) {
  const navigate = useNavigate();

  if (!projects?.length) return <span><strong>No Projects</strong></span>;

  return (
    <select
      onChange={(e) => {
        const projectId = e.target.value;
        if (projectId) {
          navigate("/state", { state: { project_id: Number(projectId) } });
        }
      }}
      defaultValue=""
      className="project-dropdown"
    >
      <option value="">Select Project</option>
      {projects.map((p) => (
        <option key={p.project_id} value={p.project_id}>
          {p.p_name}
        </option>
      ))}
    </select>
  );
}

export default ProjectsDropdown;
