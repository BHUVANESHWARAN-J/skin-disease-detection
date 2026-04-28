import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("history/");
        setItems(res.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          📋 Prediction History
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No predictions yet</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Disease</th>
                  <th className="px-6 py-4 text-left font-semibold">Confidence</th>
                  <th className="px-6 py-4 text-left font-semibold">Severity</th>
                  <th className="px-6 py-4 text-left font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x, idx) => (
                  <tr key={x.id} className={`border-t ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                    <td className="px-6 py-4 font-semibold text-blue-600">{x.predicted_disease}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${x.confidence}%` }}
                          />
                        </div>
                        <span className="font-semibold">{x.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        x.severity === "High" ? "bg-red-100 text-red-600" :
                        x.severity === "Moderate" ? "bg-yellow-100 text-yellow-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {x.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-orange-600 font-semibold">{x.doctor_priority}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(x.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
