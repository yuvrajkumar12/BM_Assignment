import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Forms } from '../api.js';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Forms.list().then(setForms).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Forms</h2>
        <Link className="btn" to="/new">+ New Form</Link>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead><tr><th>Title</th><th>Updated</th><th>Actions</th></tr></thead>
        <tbody>
          {forms.map(f => (
            <tr key={f._id}>
              <td>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{f.title}</span>
                  <span className="badge">{f.isPublished ? 'Published' : 'Draft'}</span>
                </div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>{f.description}</div>
              </td>
              <td>{f.updatedAt ? new Date(f.updatedAt).toLocaleString() : ''}</td>
              <td>
                <div className="row" style={{ gap: 8 }}>
                  <Link className="btn ghost" to={`/forms/${f._1d}/edit`}>Edit</Link>
                  <Link className="btn ghost" to={`/forms/${f._id}/responses`}>Responses</Link>
                  <Link className="btn ghost" to={`/forms/${f._id}/fill`}>Open</Link>
                  <button className="btn ghost" onClick={async () => { await Forms.duplicate(f._id); setForms(await Forms.list()); }}>Duplicate</button>
                  <button className="btn ghost" onClick={async () => { if (confirm('Delete form?')) { await Forms.remove(f._id); setForms(forms.filter(x => x._id !== f._id)); } }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
