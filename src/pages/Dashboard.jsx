import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stats from "../components/Stats";
import { useTheme } from "../context/ThemeContext";

function Dashboard({ setIsLoggedIn }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("Personal");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { darkMode, colors } = useTheme();

  const categories = ["Personal", "Work", "Shopping", "Health", "Education", "Other"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          text: newTask,
          category: newCategory,
          dueDate: newDueDate || null
        }),
      });

      if (response.ok) {
        const task = await response.json();
        setTasks([...tasks, task]);
        setNewTask("");
        setNewDueDate("");
        setError("");
      } else {
        setError("Failed to add task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
        setError("");
      } else {
        setError("Failed to delete task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((task) =>
          task.id === id ? updatedTask : task
        ));
        setError("");
      } else {
        setError("Failed to update task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setEditCategory(task.category || "Personal");
    setEditDueDate(task.dueDate || "");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          text: editText,
          category: editCategory,
          dueDate: editDueDate || null
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((task) =>
          task.id === id ? updatedTask : task
        ));
        setEditingTask(null);
        setEditText("");
        setError("");
      } else {
        setError("Failed to update task");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
      setError("No completed tasks to clear!");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (window.confirm(`Delete ${completedTasks.length} completed tasks?`)) {
      for (const task of completedTasks) {
        await deleteTask(task.id);
      }
    }
  };

  const exportTasks = () => {
    if (tasks.length === 0) {
      setError("No tasks to export!");
      setTimeout(() => setError(""), 2000);
      return;
    }
    const csv = [
      ['Task', 'Category', 'Status', 'Due Date', 'Created At'],
      ...tasks.map(t => [
        t.text,
        t.category || 'Personal',
        t.completed ? 'Completed' : 'Pending',
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date',
        new Date(t.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== "All" && filter !== "Completed" && filter !== "Pending") {
      filtered = filtered.filter(t => t.category === filter);
    }
    
    if (filter === "Completed") {
      filtered = filtered.filter(t => t.completed);
    } else if (filter === "Pending") {
      filtered = filtered.filter(t => !t.completed);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const getCategoryColor = (category) => {
    const colors = {
      Personal: "#e91e63",
      Work: "#2196f3",
      Shopping: "#4caf50",
      Health: "#ff9800",
      Education: "#9c27b0",
      Other: "#607d8b"
    };
    return colors[category] || "#607d8b";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading tasks...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "50px auto", 
      padding: "20px",
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: "100vh"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1>📋 My Tasks</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={clearCompleted}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗑️ Clear Completed
          </button>
          <button
            onClick={exportTasks}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📥 Export
          </button>
        </div>
      </div>

      <Stats tasks={tasks} />

      {error && (
        <div style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "4px",
          border: "1px solid #ef9a9a",
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={addTask} style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            style={{
              flex: 2,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              minWidth: "200px",
            }}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Add Task
          </button>
        </div>
      </form>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["All", "Pending", "Completed", ...categories].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              style={{
                padding: "8px 16px",
                backgroundColor: filter === filterOption ? "#1976d2" : "#e0e0e0",
                color: filter === filterOption ? "white" : "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
          No tasks found. Add your first task above! 🎯
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: colors.card,
                borderRadius: "8px",
                gap: "10px",
                flexWrap: "wrap",
                border: `1px solid ${colors.border}`,
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />

              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      flex: 2,
                      padding: "5px",
                      border: "1px solid #1976d2",
                      borderRadius: "4px",
                      minWidth: "150px",
                    }}
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={{
                      padding: "5px",
                      border: "1px solid #1976d2",
                      borderRadius: "4px",
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    style={{
                      padding: "5px",
                      border: "1px solid #1976d2",
                      borderRadius: "4px",
                    }}
                  />
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 2,
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#666" : colors.text,
                      minWidth: "150px",
                    }}
                  >
                    {task.text}
                  </span>
                  <span
                    style={{
                      padding: "2px 10px",
                      backgroundColor: getCategoryColor(task.category || "Personal"),
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.category || "Personal"}
                  </span>
                  {task.dueDate && (
                    <span style={{ fontSize: "12px", color: "#666", whiteSpace: "nowrap" }}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </>
              )}

              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {editingTask === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    style={{
                      padding: "5px 12px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(task)}
                    style={{
                      padding: "5px 12px",
                      backgroundColor: "#ffa726",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: "5px 12px",
                    backgroundColor: "#ef5350",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
        {filteredTasks.filter(t => !t.completed).length} tasks remaining
        {tasks.length > 0 && (
          <span style={{ marginLeft: "10px" }}>
            • {tasks.filter(t => t.completed).length} completed
          </span>
        )}
      </div>
    </div>
  );
}

export default Dashboard;