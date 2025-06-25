import './App.css';
import { Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

export const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="mb-auto h-10 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
