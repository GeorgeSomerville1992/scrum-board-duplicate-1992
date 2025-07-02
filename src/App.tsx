import './App.css';
import { Home } from './components/Home/Home';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

export const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="mb-auto h-10 flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;
