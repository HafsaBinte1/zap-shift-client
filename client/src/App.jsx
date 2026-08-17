import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/routing/RoleRoute';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrackOrder from './pages/TrackOrder';

import MerchantDashboard from './pages/merchant/MerchantDashboard';
import CreateOrder from './pages/merchant/CreateOrder';
import MyOrders from './pages/merchant/MyOrders';
import OrderDetail from './pages/merchant/OrderDetail';

import RiderDashboard from './pages/rider/RiderDashboard';
import RiderProfile from './pages/rider/RiderProfile';
import AvailableJobs from './pages/rider/AvailableJobs';
import MyDeliveries from './pages/rider/MyDeliveries';
import DeliveryDetail from './pages/rider/DeliveryDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/track/:code" element={<TrackOrder />} />

            <Route
              path="/merchant"
              element={
                <RoleRoute role="merchant">
                  <MerchantDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/merchant/create"
              element={
                <RoleRoute role="merchant">
                  <CreateOrder />
                </RoleRoute>
              }
            />
            <Route
              path="/merchant/orders"
              element={
                <RoleRoute role="merchant">
                  <MyOrders />
                </RoleRoute>
              }
            />
            <Route
              path="/merchant/orders/:id"
              element={
                <RoleRoute role="merchant">
                  <OrderDetail />
                </RoleRoute>
              }
            />

            <Route
              path="/rider"
              element={
                <RoleRoute role="deliveryMan">
                  <RiderDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/profile"
              element={
                <RoleRoute role="deliveryMan">
                  <RiderProfile />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/available"
              element={
                <RoleRoute role="deliveryMan">
                  <AvailableJobs />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/jobs"
              element={
                <RoleRoute role="deliveryMan">
                  <MyDeliveries />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/jobs/:id"
              element={
                <RoleRoute role="deliveryMan">
                  <DeliveryDetail />
                </RoleRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
