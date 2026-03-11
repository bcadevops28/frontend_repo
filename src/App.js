import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    caseTitle: '',
    description: '',
    defenderName: '',
    offenderName: '',
    caseType: 'NORMAL',
    caseStatus: 'OPEN'
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch cases
  useEffect(() => {
    fetch("https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCases(data);
        } else {
          setCases([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setCases([]);
      });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Add / Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/${editingId}`
      : 'https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/';

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
  method: method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
  .then(async res => {
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);

    if (!res.ok) {
      throw new Error(text);
    }

    return JSON.parse(text);
  })
  .then(result => {
    if (editingId) {
      setCases(prev =>
        prev.map(c => (c.id === editingId ? result : c))
      );
      setEditingId(null);
    } else {
      setCases(prev => [...prev, result]);
    }
    resetForm();
  })
  .catch(err => console.error("Save error:", err));

  };

  // Delete
  const handleDelete = (id) => {
    fetch(`https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setCases(prev => prev.filter(c => c.id !== id));
      })
      .catch(err => console.error("Delete error:", err));
  };

  // Edit
  const handleEdit = (c) => {
    setFormData({
      caseTitle: c.caseTitle,
      description: c.description,
      defenderName: c.defenderName,
      offenderName: c.offenderName,
      caseType: c.caseType,
      caseStatus: c.caseStatus
    });
    setEditingId(c.id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      caseTitle: '',
      description: '',
      defenderName: '',
      offenderName: '',
      caseType: 'NORMAL',
      caseStatus: 'OPEN'
    });
  };

  return (
    <div className="container">
      <h1>Court Case Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="caseTitle"
          placeholder="Case Title"
          value={formData.caseTitle}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="defenderName"
          placeholder="Defender Name"
          value={formData.defenderName}
          onChange={handleChange}
        />

        <input
          name="offenderName"
          placeholder="Offender Name"
          value={formData.offenderName}
          onChange={handleChange}
        />

        <select
          name="caseType"
          value={formData.caseType}
          onChange={handleChange}
        >
          <option value="NORMAL">Normal</option>
          <option value="CRIMINAL">Criminal</option>
        </select>

        <select
          name="caseStatus"
          value={formData.caseStatus}
          onChange={handleChange}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>

        <button type="submit">
          {editingId ? "Update Case" : "Add Case"}
        </button>
      </form>

      <div className="case-list">
        <h2>All Cases</h2>

        {cases.length === 0 && (
          <p>No cases available</p>
        )}

        {cases.map(c => (
          <div key={c.id} className="case-card">
            <div className="case-title">{c.caseTitle}</div>

            <div className="case-meta">
              Type: {c.caseType} | Status: {c.caseStatus}<br />
              Defender: {c.defenderName} | Offender: {c.offenderName}
            </div>

            <p>{c.description}</p>

            <div className="case-actions">
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
