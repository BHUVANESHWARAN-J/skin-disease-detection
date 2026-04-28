import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="font-bold text-2xl hover:text-blue-100">
        Skin AI
      </Link>

      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-blue-100 transition">Home</Link>
        {user && (
          <>
            <Link to="/upload" className="hover:text-blue-100 transition">Upload</Link>
            <Link to="/history" className="hover:text-blue-100 transition">History</Link>
            <Link to="/dashboard" className="hover:text-blue-100 transition">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
