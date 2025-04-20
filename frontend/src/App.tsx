import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Events from './pages/Events/Events';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EventDetails from './pages/EventDetails/EventDetails';
import EditEvent from './pages/EditEvent/EditEvent';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import './App.scss';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/events" />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/events" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/login" />} />
      <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/login" />} />
      <Route path="/events/create" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />
      <Route path="/events/:id" element={isAuthenticated ? <EventDetails /> : <Navigate to="/login" />} />
      <Route path="/events/:id/edit" element={isAuthenticated ? <EditEvent /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="main">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
