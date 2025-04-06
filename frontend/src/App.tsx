import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/authService';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Events from './pages/Events/Events';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EventDetails from './pages/EventDetails/EventDetails';
import NotFound from './pages/NotFound/NotFound';
import './App.scss';

const App: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
            />
            <Route path="/" element={isAuthenticated ? <Events /> : <Navigate to="/login" />} />
            <Route
              path="/events/create"
              element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />}
            />
            <Route
              path="/events/:id"
              element={isAuthenticated ? <EventDetails /> : <Navigate to="/login" />}
            />
            <Route path="/events/:id/edit" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
