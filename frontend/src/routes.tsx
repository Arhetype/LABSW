import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Events from './pages/Events/Events';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EventDetails from './pages/EventDetails/EventDetails';
import EditEvent from './pages/EditEvent/EditEvent';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="app">
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={user ? <Events /> : <Navigate to="/login" />} />
                    <Route
                        path="/events/create"
                        element={user ? <CreateEvent /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/events/:id"
                        element={user ? <EventDetails /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/events/:id/edit"
                        element={user ? <EditEvent /> : <Navigate to="/login" />}
                    />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes; 