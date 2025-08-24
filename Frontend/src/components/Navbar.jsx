import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <div className="card" style={{ borderRadius: 0 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontWeight: 700, color: 'white' }}>No-Code Forms</Link>
        <div className="row" style={{ gap: 8 }}>
          <Link className="btn ghost" to="/">Forms</Link>
          <Link className="btn" to="/new">Create Form</Link>
        </div>
      </div>
    </div>
  );
}
