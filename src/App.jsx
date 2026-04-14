import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Dsa from "./pages/Dsa"
import Goals from "./pages/Goals"
import Login from "./pages/Login"
import Timer from "./pages/Timer"
import Layout from "./components/Layout"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dsa" element={<Dsa />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/timer" element={<Timer />} />
      </Route>
      <Route path="/login" element={<Login />} />
      
    </Routes>
  )
}

export default App
