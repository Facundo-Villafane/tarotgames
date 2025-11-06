import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Background } from './components/ui/Background';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Home } from './pages/Home';
import { Reading } from './pages/Reading';
import { preloadAllCards } from './utils/imagePreloader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(79); // 79 cards total

  useEffect(() => {
    // Preload all card images on app start
    preloadAllCards((current, total) => {
      setProgress(current);
      setTotal(total);
    })
      .then(() => {
        // Add a small delay to show 100% before hiding
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error('Error preloading cards:', error);
        // Still allow the app to load even if preloading fails
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={progress} total={total} />;
  }

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
