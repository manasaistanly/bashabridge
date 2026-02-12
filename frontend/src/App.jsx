import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSelection from './pages/LanguageSelection';
import Learning from './pages/Learning';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import './index.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <LanguageSelection />
                        </ProtectedRoute>
                    } />
                    <Route path="/learn" element={
                        <ProtectedRoute>
                            <Learning />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* Redirect to login by default */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
