import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import History from './pages/History';
import Profile from './pages/Profile';
import ChatDetailView from './components/ChatDetailView';
import MobileLayout from './components/MobileLayout';

function App() {
  const isLoggedIn = () => !!localStorage.getItem('userId');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with MobileLayout */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={isLoggedIn() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/history" element={isLoggedIn() ? <History /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />} />
        </Route>

        {/* Chat Detail - separate layout */}
        <Route path="/chat/:chatId" element={isLoggedIn() ? <ChatDetailView /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
