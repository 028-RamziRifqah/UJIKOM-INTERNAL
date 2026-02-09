import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import GameDetail from "./pages/GameDetail"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Register from "./pages/Register"
import History from "./pages/History"
import Products from "./admin/pages/Products"
import Categories from "./admin/pages/Categories"
import Transactions from "./admin/pages/Transactions"
import SalesReport from "./admin/pages/SalesReport"
import AdminRoute from "./admin/components/AdminRoute"
import Events from "./admin/pages/Events"


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/game/:id"
            element={
              <GameDetail />
            }
          />

          <Route path="/admin/dashboard" element={
            <AdminRoute><Products /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><Products /></AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute><Categories /></AdminRoute>
          } />
          <Route path="/admin/transactions" element={
            <AdminRoute><Transactions /></AdminRoute>
          } />
          <Route path="/admin/sales-report" element={
            <AdminRoute><SalesReport /></AdminRoute>
          } />
          <Route path="/admin/events" element={
            <AdminRoute><Events /></AdminRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}