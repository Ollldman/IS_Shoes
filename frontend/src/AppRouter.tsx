import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyOrders from './pages/Dashboard/MyOrders';
import CreateOrder from './pages/Dashboard/CreateOrder';
import Profile from './pages/Dashboard/Profile';
import ManageOrders from './pages/Dashboard/ManageOrders';




const AppRouter = () => {
  return (
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Если пользователь зайдет на неизвестный URL - редирект на главную */}
                <Route path="*" element={<Navigate to="/" replace />} />
                {/* Защищенные маршруты: */}
                {/* Защищенные маршруты Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  {/* Вложенные маршруты через Outlet */}
                  <Route index element={<Navigate to="my-orders" replace />} />
                  <Route path="my-orders" element={<MyOrders />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="create-order" element={<CreateOrder />} />
                  <Route
                    path="manage-orders"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'manager']}>
                        <ManageOrders />
                      </ProtectedRoute>
                    }
                  />
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;