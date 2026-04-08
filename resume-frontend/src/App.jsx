import { useEffect } from "react";                                     
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import About from "./pages/About";
import ResumeRewriter from "./pages/ResumeRewriter";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
    axios.get("http://127.0.0.1:8000/api/auth/csrf/", { withCredentials: true })
      .then(res => {
        axios.defaults.headers.common["X-CSRFToken"] = res.data.csrfToken;
      });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — redirects to /login if no token */}
        <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
        <Route path="/rewriter" element={<ProtectedRoute><ResumeRewriter /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;