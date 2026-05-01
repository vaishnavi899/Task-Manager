import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    project: ""
  });

  const [projectName, setProjectName] = useState("");

  const role = localStorage.getItem("role");

  // 🔥 Fetch all data
  const fetchData = async () => {
    try {
      const [taskRes, userRes, projectRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/users"),
        API.get("/projects")
      ]);

      setTasks(taskRes.data);
      setUsers(userRes.data);
      setProjects(projectRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 Create Task
  const createTask = async () => {
    try {
      await API.post("/tasks", newTask);

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        assignedTo: "",
        project: ""
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Create Project
  const createProject = async () => {
    if (!projectName) return;

    try {
      await API.post("/projects", { name: projectName });
      setProjectName("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Filter tasks by project
  const filteredTasks = selectedProject
    ? tasks.filter(t => t.project?._id === selectedProject)
    : tasks;

  // 🔥 Stats
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "Done").length;
  const pending = tasks.filter(t => t.status !== "Done").length;

  return (
    <div>

      {/* 🔥 NAVBAR */}
      <div className="navbar">
        <h2>Task Manager</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <div className="container">

        <h2>Dashboard</h2>

        {/* 🔥 STATS */}
        <div className="stats">
          <div>Total: {total}</div>
          <div>Done: {done}</div>
          <div>Pending: {pending}</div>
        </div>

        {/* 🔥 PROJECT FILTER */}
        <select
          className="input"
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* 🔥 CREATE PROJECT (ADMIN ONLY) */}
        {role === "Admin" && (
          <div className="card">
            <h3>Create Project</h3>

            <input
              className="input"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <button onClick={createProject}>
              Create Project
            </button>
          </div>
        )}

        {/* 🔥 CREATE TASK */}
        <div className="card">
          <h3>Create Task</h3>

          <input
            className="input"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />

          <input
            className="input"
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />

          {/* 🔥 ASSIGN USER (ADMIN ONLY) */}
          {role === "Admin" && (
            <select
              className="input"
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  assignedTo: e.target.value
                })
              }
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          {/* 🔥 PROJECT DROPDOWN */}
          <select
            className="input"
            onChange={(e) =>
              setNewTask({
                ...newTask,
                project: e.target.value
              })
            }
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={createTask}>
            Add Task
          </button>
        </div>

        {/* 🔥 EMPTY STATE */}
        {filteredTasks.length === 0 && (
          <p className="empty">No tasks yet 🚀</p>
        )}

        {/* 🔥 TASK LIST */}
        {filteredTasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            refresh={fetchData}
          />
        ))}
      </div>
    </div>
  );
}

/* 🔥 TASK CARD */
function TaskCard({ task, refresh }) {
  const isOverdue =
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  return (
    <div className="card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      {/* 🔥 STATUS DROPDOWN */}
      <select
        value={task.status}
        onChange={async (e) => {
          await API.put(`/tasks/${task._id}`, {
            status: e.target.value
          });
          refresh();
        }}
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <p>Assigned: {task.assignedTo?.name || "Unassigned"}</p>
      <p>Project: {task.project?.name}</p>

      {isOverdue && (
        <p style={{ color: "red" }}>
          ⚠ Overdue
        </p>
      )}
    </div>
  );
}