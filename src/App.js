import React, { useState, useEffect } from 'react';
import './style.css';

const API = "https://vetri-demo-backend-ezaeapa7a3cddahr.centralindia-01.azurewebsites.net/api/cases";

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

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    fetch(url,{
      method:method,
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(formData)
    })
    .then(res=>res.json())
    .then(()=>{
      window.location.reload();
    });
  };

  const handleDelete = (id) => {
    fetch(`${API}/${id}`,{method:"DELETE"})
    .then(()=>window.location.reload());
  };

  const handleEdit = (c) => {
    setFormData(c);
    setEditingId(c.id);
  };

  return (
    <div className="container">
      <h1>Court Case Management</h1>

      <form onSubmit={handleSubmit}>
        <input name="caseTitle" placeholder="Case Title" value={formData.caseTitle} onChange={handleChange} required />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

        <input name="defenderName" placeholder="Defender Name" value={formData.defenderName} onChange={handleChange} />

        <input name="offenderName" placeholder="Offender Name" value={formData.offenderName} onChange={handleChange} />

        <select name="caseType" value={formData.caseType} onChange={handleChange}>
          <option value="NORMAL">Normal</option>
          <option value="CRIMINAL">Criminal</option>
        </select>

        <select name="caseStatus" value={formData.caseStatus} onChange={handleChange}>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>

        <button type="submit">
          {editingId ? "Update Case" : "Add Case"}
        </button>
      </form>

      <h2>All Cases</h2>

      {cases.map(c => (
        <div key={c.id}>
          <h3>{c.caseTitle}</h3>
          <p>{c.description}</p>
          <p>Type: {c.caseType} | Status: {c.caseStatus}</p>

          <button onClick={()=>handleEdit(c)}>Edit</button>
          <button onClick={()=>handleDelete(c.id)}>Delete</button>
        </div>
      ))}

    </div>
  );
}

export default App;