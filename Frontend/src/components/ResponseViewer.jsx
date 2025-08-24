import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Forms, Responses } from '../api.js';

export default function ResponseViewer() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (!id) return;
    Forms.get(id).then(setForm).catch(console.error);
    Responses.list(id).then(setResponses).catch(console.error);
  }, [id]);

  const headers = useMemo(() => {
    if (!form) return [];
    return ['_id', 'createdAt', ...(form.fields || []).map(f => f.label)];
  }, [form]);

  const rows = useMemo(() => {
    if (!form) return [];
    const map = new Map((form.fields || []).map(f => [f.id, f.label]));
    return (responses || []).map(r => {
      const row = { _id: r._id, createdAt: new Date(r.createdAt).toLocaleString() };
      for (const a of r.answers || []) {
        row[map.get(a.fieldId) || a.fieldId] = Array.isArray(a.value) ? a.value.join('; ') : (a.value ?? '');
      }
      return row;
    });
  }, [form, responses]);
  if (!form) return <div>Loading...</div>;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Responses • {form.title}</h2>
          <Link to={`/forms/${id}/fill`} className="btn ghost" style={{ marginTop: 8 }}>Open Form</Link>
        </div>
        <a className="btn" href={Responses.csvUrl(id)}>Download CSV</a>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table className="table">
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row._id}>
                {headers.map(h => <td key={h}>{row[h] ?? ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
