import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Forms } from '../api.js';
import FieldEditor from './FieldEditor.jsx';

const FIELD_TYPES = [
  { type: 'text', label: 'Text' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'number', label: 'Number' },
  { type: 'email', label: 'Email' },
  { type: 'date', label: 'Date' },
  { type: 'select', label: 'Dropdown' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'checkbox-group', label: 'Checkbox Group' }
];

const EMPTY_FIELD = (type = 'text') => ({
  id: crypto.randomUUID(),
  label: 'Untitled',
  type,
  required: false,
  placeholder: '',
  helperText: '',
  options: ['select', 'radio', 'checkbox-group'].includes(type) ? [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] : [],
  width: 'full',
  order: 0
});

export default function FormBuilder({ onSaved }) {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState({ title: 'Untitled Form', description: '', theme: { primary: '#2563eb', font: 'system-ui' }, fields: [], isPublished: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      Forms.get(id).then(setForm).catch(console.error);
    }
  }, [id]);

  const sortedFields = useMemo(() => [...(form.fields || [])].sort((a, b) => a.order - b.order), [form.fields]);

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, fields: (form.fields || []).map((f, i) => ({ ...f, order: i })) };
      const saved = isNew ? await Forms.create(payload) : await Forms.update(id, payload);
      if (onSaved) onSaved(saved);
      else nav(`/forms/${saved._id}/edit`);
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid">
      <div className="col-full">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input className="input" style={{ fontSize: 24, fontWeight: 700 }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn ghost" onClick={() => setForm({ ...form, isPublished: !form.isPublished })}>{form.isPublished ? 'Unpublish' : 'Publish'}</button>
              <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-third">
        <div className="card">
          <strong>Add Fields</strong>
          <div className="row" style={{ marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
            {FIELD_TYPES.map(t => (
              <button key={t.type} className="btn ghost" onClick={() => setForm({ ...form, fields: [...(form.fields || []), EMPTY_FIELD(t.type)] })}>{t.label}</button>
            ))}
          </div>

          <hr style={{ borderColor: '#1f2937', margin: '16px 0' }} />

          <strong>Theme</strong>
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            <input className="input" type="color" value={form.theme.primary} onChange={(e) => setForm({ ...form, theme: { ...form.theme, primary: e.target.value } })} />
            <select className="input" value={form.theme.font} onChange={(e) => setForm({ ...form, theme: { ...form.theme, font: e.target.value } })}>
              <option>system-ui</option>
              <option>Inter</option>
              <option>Roboto</option>
              <option>Poppins</option>
            </select>
          </div>
        </div>
      </div>

      <div className="col-two-third col-full">
        <div className="card">
          <strong>Fields</strong>
          <div style={{ marginTop: 8, display: 'grid', gap: 12 }}>
            {sortedFields.length === 0 && <div style={{ color: '#9ca3af' }}>No fields yet. Add one from the left panel.</div>}
            {sortedFields.map((f) => (
              <FieldEditor key={f.id} field={f} onChange={(nf) => setForm({ ...form, fields: form.fields.map(x => x.id === f.id ? nf : x) })} onRemove={() => setForm({ ...form, fields: form.fields.filter(x => x.id !== f.id) })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
