import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Background } from './components/ui/Background';
import { Home } from './pages/Home';
import { Reading } from './pages/Reading';

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <Background />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reading/:spreadId" element={<Reading />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
