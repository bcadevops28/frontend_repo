import React, { useState, useEffect } from "react";
import "./App.css";

// ✅ AUTO SWITCH (LOCAL ↔ AZURE)
const API = window.location.hostname === "localhost"
  ? "https://your-backend-url/api/cases"
  : "https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/api/cases";
function App() {
  
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    caseTitle: "",
    description: "",
    defenderName: "",
    offenderName: "",
    caseStatus: "OPEN",
    caseType: "CRIMINAL"
  });

  useEffect(() => {
    fetchCases();
  }, []);

  // ✅ FETCH CASES
  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error(err);
      // Remove alert - just show empty list
      setCases([]);
    }
    setLoading(false);
  };

  // ✅ ADD CASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const text = await res.text();
      console.log("ADD RESPONSE:", text);

      if (!res.ok) {
        alert("❌ " + text);
        return;
      }

      alert("✅ Case Added");

      // refresh list
      await fetchCases();

      // reset form
      setFormData({
        caseTitle: "",
        description: "",
        defenderName: "",
        offenderName: "",
        caseStatus: "OPEN",
        caseType: "CRIMINAL"
      });

    } catch (err) {
      console.error(err);
      alert("❌ Network Error");
    }
  };

  // ✅ OPEN DELETE MODAL
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // ✅ DELETE CASE
  const handleDelete = async () => {
    try {
      if (!deleteId) {
        alert("❌ Invalid ID");
        return;
      }

      const res = await fetch(`${API}/${deleteId}?password=${password}`, {
        method: "DELETE"
      });

      const text = await res.text();
      console.log("DELETE RESPONSE:", text);

      if (!res.ok) {
        alert("❌ " + text);
        return;
      }

      alert("🗑️ Case Deleted");

      setShowModal(false);
      setPassword("");

      // refresh list
      await fetchCases();

    } catch (err) {
      console.error(err);
      alert("❌ Delete Failed");
    }
  };

  return (
    <div className="container">

      <h1>⚖️ Court Case System ⚖️</h1>

      <span className="badge">
        {window.location.hostname === "localhost" ? "💻 Local" : "☁️ Azure"}
      </span>

      {/* FORM */}
      <form className="glass" onSubmit={handleSubmit}>
        <input
          placeholder="Case Title"
          value={formData.caseTitle}
          onChange={(e) =>
            setFormData({ ...formData, caseTitle: e.target.value })
          }
          required
        />

        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <input
          placeholder="Defender"
          value={formData.defenderName}
          onChange={(e) =>
            setFormData({ ...formData, defenderName: e.target.value })
          }
          required
        />

        <input
          placeholder="Offender"
          value={formData.offenderName}
          onChange={(e) =>
            setFormData({ ...formData, offenderName: e.target.value })
          }
          required
        />

        <select
          value={formData.caseStatus}
          onChange={(e) =>
            setFormData({ ...formData, caseStatus: e.target.value })
          }
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <select
          value={formData.caseType}
          onChange={(e) =>
            setFormData({ ...formData, caseType: e.target.value })
          }
        >
          <option value="NORMAL">NORMAL</option>
          <option value="CRIMINAL">CRIMINAL</option>
        </select>

        <button>Add Case</button>
      </form>

      {/* LOADING */}
      {loading && <p className="loading">Loading...</p>}

      {/* CASE LIST */}
      <div className="grid">
        {cases.length === 0 ? (
          <p className="empty">No Cases Found</p>
        ) : (
          cases.map((c) => (
            <div key={c.id} className="card">
              <h3>{c.caseTitle}</h3>
              <p>{c.description}</p>

              <div className="tags">
                <span>{c.caseStatus}</span>
                <span>{c.caseType}</span>
              </div>

              <p>
                <b>{c.defenderName}</b> vs <b>{c.offenderName}</b>
              </p>

              <button
                className="delete"
                onClick={() => confirmDelete(c.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>🔐 Enter Password</h3>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="modal-btns">
              <button onClick={handleDelete}>Confirm</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;