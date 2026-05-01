import API from "../api/api";

export default function TaskCard({ task, refresh }) {

  const markDone = async () => {
    await API.put(`/tasks/${task._id}`, { status: "Done" });
    refresh();
  };

  return (
    <div className="card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <p>Status: 
        <span className={task.status === "Done" ? "done" : ""}>
          {task.status}
        </span>
      </p>

      <p>Assigned: {task.assignedTo?.name || "Unassigned"}</p>
      <p>Project: {task.project?.name}</p>

      {task.isOverdue && <p className="overdue">⚠ Overdue</p>}

      {task.status !== "Done" && (
        <button className="btn" onClick={markDone}>
          Mark Done
        </button>
      )}
    </div>
  );
}