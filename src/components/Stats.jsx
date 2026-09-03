function Stats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categories = {};
  tasks.forEach(task => {
    const cat = task.category || 'Personal';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginBottom: "20px"
    }}>
      <div style={{
        padding: "15px",
        backgroundColor: "#e3f2fd",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>📊 Total</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>{total}</p>
      </div>
      <div style={{
        padding: "15px",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>✅ Completed</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0", color: "#2e7d32" }}>
          {completed}
        </p>
      </div>
      <div style={{
        padding: "15px",
        backgroundColor: "#fff3e0",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>⏳ Pending</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0", color: "#e65100" }}>
          {pending}
        </p>
      </div>
      <div style={{
        padding: "15px",
        backgroundColor: "#f3e5f5",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>📈 Progress</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0", color: "#6a1b9a" }}>
          {completionRate}%
        </p>
      </div>
    </div>
  );
}

export default Stats;