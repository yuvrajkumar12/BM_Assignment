export default function FieldEditor({ field, onChange, onRemove }) {
  return (
    <div className="card" style={{ borderStyle: 'dashed' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{field.label || 'Untitled'} <span style={{ color: '#9ca3af' }}>({field.type})</span></strong>
        <button className="btn ghost" onClick={onRemove}>Remove</button>
      </div>
      <div className="grid" style={{ marginTop: 10 }}>
        <div className="col-half">
          <label>Label</label>
          <input className="input" value={field.label} onChange={(e) => onChange({ ...field, label: e.target.value })} />
        </div>
        <div className="col-half">
          <label>Placeholder</label>
          <input className="input" value={field.placeholder} onChange={(e) => onChange({ ...field, placeholder: e.target.value })} />
        </div>
        <div className="col-half">
          <label>Width</label>
          <select className="input" value={field.width} onChange={(e) => onChange({ ...field, width: e.target.value })}>
            <option value="full">Full</option>
            <option value="half">Half</option>
            <option value="third">Third</option>
          </select>
        </div>
        <div className="col-half">
          <label>Required</label>
          <select className="input" value={field.required ? 'yes' : 'no'} onChange={(e) => onChange({ ...field, required: e.target.value === 'yes' })}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div className="col-full">
          <label>Helper Text</label>
          <input className="input" value={field.helperText} onChange={(e) => onChange({ ...field, helperText: e.target.value })} />
        </div>
        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox-group') && (
          <div className="col-full">
            <label>Options</label>
            {field.options.map((opt, idx) => (
              <div key={idx} className="row" style={{ gap: 8, marginTop: 6 }}>
                <input className="input" value={opt.label} onChange={(e) => { const options = [...field.options]; options[idx] = { ...opt, label: e.target.value }; onChange({ ...field, options }); }} />
                <input className="input" value={opt.value} onChange={(e) => { const options = [...field.options]; options[idx] = { ...opt, value: e.target.value }; onChange({ ...field, options }); }} />
                <button className="btn ghost" onClick={() => { const options = field.options.filter((_, i) => i !== idx); onChange({ ...field, options }); }}>Remove</button>
              </div>
            ))}
            <button className="btn" style={{ marginTop: 8 }} onClick={() => onChange({ ...field, options: [...field.options, { label: 'New option', value: `opt${field.options.length + 1}` }] })}>+ Add Option</button>
          </div>
        )}
      </div>
    </div>
  );
}
