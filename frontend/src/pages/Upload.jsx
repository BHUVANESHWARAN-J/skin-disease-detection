import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        nav("/login");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("predict/", formData);
      localStorage.setItem("result", JSON.stringify(res.data));
      nav("/result");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Prediction failed";
      console.error("Prediction error:", err.response?.data || err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-white shadow-xl p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            📸 Upload Skin Image
          </h2>
          <p className="text-gray-600 mb-6">
            Choose a clear image of the skin area for analysis
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files[0];
                setFile(selected);
                setError("");
                setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
              }}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {file ? (
                <div>
                  <p className="font-semibold text-blue-600">{file.name}</p>
                  <p className="text-sm text-gray-500">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </label>

            {previewUrl && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Selected image preview</p>
                <img
                  src={previewUrl}
                  alt="Selected skin preview"
                  className="mx-auto w-full max-h-64 object-contain rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            onClick={submit}
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Analyze Image"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
