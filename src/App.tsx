import './App.css';
import { Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Scrum App</h1>
        </div>
        <p className="text-gray-600 ml-11">Use scrum board duplicate</p>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="mt-8 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Scrum Board Duplicate</p>
      </footer>
    </>
  );
};

export default App;
