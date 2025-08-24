import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import FormList from './components/FormList.jsx';
import FormBuilder from './components/FormBuilder.jsx';
import FormRenderer from './components/FormRenderer.jsx';
import ResponseViewer from './components/ResponseViewer.jsx';

export default function App() {
  const nav = useNavigate();
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<FormList />} />
          <Route path="/new" element={<FormBuilder onSaved={(f) => nav(`/forms/${f._id}/edit`)} />} />
          <Route path="/forms/:id/edit" element={<FormBuilder />} />
          <Route path="/forms/:id/fill" element={<FormRenderer />} />
          <Route path="/forms/:id/responses" element={<ResponseViewer />} />
        </Routes>
      </div>
    </>
  );
}
