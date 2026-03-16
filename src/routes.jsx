import { Routes, Route, Navigate } from 'react-router-dom'
import Home               from './pages/Home'
import Login              from './pages/Login'
import Register           from './pages/Register'
import RescuesList        from './pages/RescuesList'
import RescueDetails      from './pages/RescueDetails'
import PostRescue         from './pages/PostRescue'
import VolunteerDashboard from './pages/VolunteerDashboard'
import DonationPage       from './pages/DonationPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                      element={<Home />} />
      <Route path="/login"                 element={<Login />} />
      <Route path="/register"              element={<Register />} />
      <Route path="/rescues"               element={<RescuesList />} />
      <Route path="/rescues/:id"           element={<RescueDetails />} />
      <Route path="/post-rescue"           element={<PostRescue />} />
      <Route path="/volunteer-dashboard"   element={<VolunteerDashboard />} />
      <Route path="/donate"                element={<DonationPage />} />
      <Route path="*"                      element={<Navigate to="/" replace />} />
    </Routes>
  )
}
