import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          🏥 AI Skin Disease Detection
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload an image and receive intelligent screening results powered by advanced machine learning technology.
        </p>

        {!user ? (
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition inline-block font-semibold"
            >
              Register
            </Link>
          </div>
        ) : (
          <Link
            to="/upload"
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition inline-block font-semibold text-lg"
          >
            Start Scan
          </Link>
        )}
      </div>

      <Footer />
    </div>
  );
}
