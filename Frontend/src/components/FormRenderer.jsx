import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Forms, Responses } from '../api.js';

function Field({ field, value, onChange, theme }) {
  const base = { borderColor: theme?.primary || '#2563eb' };
  const label = <label style={{ display: 'block', marginBottom: 6 }}>{field.label} {field.required && <span style={{ color: '#f87171' }}>*</span>}</label>;
  const commonProps = { className: 'input', value: value ?? '', onChange: (e) => onChange(e.target.value), placeholder: field.placeholder };
  const wrapClass = field.width === 'full' ? 'col-full' : field.width === 'half' ? 'col-half' : 'col-third';

  return (
    <div className={wrapClass}>
      {label}
      {field.type === 'text' && <input style={base} {...commonProps} />}
      {field.type === 'email' && <input type="email" style={base} {...commonProps} />}
      {field.type === 'number' && <input type="number" style={base} {...commonProps} />}
      {field.type === 'date' && <input type="date" style={base} {...commonProps} />}
      {field.type === 'textarea' && <textarea style={base} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />}
      {field.type === 'checkbox' && (
        <div>
          <input id={field.id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <label htmlFor={field.id} style={{ marginLeft: 8 }}>{field.helperText || 'Check if applies'}</label>
        </div>
      )}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox-group') && (
        <div>
          {field.type === 'select' ? (
            <select className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select...</option>
              {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : field.type === 'radio' ? (
            <div className="row" style={{ gap: 12 }}>
              {field.options.map(o => (
                <label key={o.value}>
                  <input type="radio" name={field.id} value={o.value} checked={value === o.value} onChange={(e) => onChange(e.target.value)} /> {o.label}
                </label>
              ))}
            </div>
          ) : (
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              {field.options.map(o => {
                const arr = Array.isArray(value) ? value : [];
                const checked = arr.includes(o.value);
                return (
                  <label key={o.value}>
                    <input type="checkbox" checked={checked} onChange={() => {
                      const next = checked ? arr.filter(v => v !== o.value) : [...arr, o.value];
                      onChange(next);
                    }} /> {o.label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
      {field.helperText && <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>{field.helperText}</div>}
    </div>
  );
}

export default function FormRenderer() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (id) Forms.get(id).then(setForm).catch(console.error);
  }, [id]);

  if (!form) return <div>Loading...</div>;

  function validate() {
    const errors = [];
    for (const f of form.fields || []) {
      const v = answers[f.id];
      if (f.required && (v == null || v === '' || (Array.isArray(v) && v.length === 0) || (f.type === 'checkbox' && !v))) {
        errors.push(`${f.label} is required`);
      }
      if (f.type === 'email' && v) {
        const ok = /.+@.+\..+/.test(v);
        if (!ok) errors.push(`${f.label} must be a valid email`);
      }
    }
    return errors;
  }

  async function submit() {
    const errs = validate();
    if (errs.length) { alert(errs.join('\n')); return; }
    await Responses.submit(form._id, Object.entries(answers).map(([fieldId, value]) => ({ fieldId, value })));
    setSent(true);
  }

  if (sent) return (
    <div className="card">
      <h2>Thanks! 🎉</h2>
      <p>Your response was submitted successfully.</p>
    </div>
  );

  return (
    <div className="card" style={{ borderColor: form.theme?.primary }}>
      <h2 style={{ marginTop: 0 }}>{form.title}</h2>
      <p style={{ color: '#9ca3af' }}>{form.description}</p>
      <div className="grid">
        {(form.fields || []).sort((a, b) => a.order - b.order).map(f => (
          <Field key={f.id} field={f} theme={form.theme} value={answers[f.id]} onChange={(v) => setAnswers({ ...answers, [f.id]: v })} />
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn" onClick={submit}>Submit</button>
      </div>
    </div>
  );
}
