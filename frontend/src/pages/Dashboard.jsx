import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("dashboard/");
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Failed to load dashboard"}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pieData = {
    labels: data.top_diseases.map(x => x.predicted_disease),
    datasets: [
      {
        data: data.top_diseases.map(x => x.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          📊 Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Predictions Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Predictions</p>
                <p className="text-4xl font-bold text-blue-700 mt-2">
                  {data.total_predictions}
                </p>
              </div>
              <div className="text-5xl text-blue-200">📈</div>
            </div>
          </div>

          {/* Top Diseases Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold">Top Disease</p>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {data.top_diseases[0]?.predicted_disease || 'N/A'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {data.top_diseases[0]?.count || 0} cases
            </p>
          </div>

          {/* Recent Scans Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-orange-600">
            <p className="text-gray-600 text-sm font-semibold">Recent Scans</p>
            <p className="text-4xl font-bold text-orange-700 mt-2">
              {data.recent.length}
            </p>
            <p className="text-gray-500 text-sm mt-1">in last check</p>
          </div>
        </div>

        {/* Disease Distribution Chart */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Disease Distribution
          </h2>

          <div className="flex justify-center">
            <div className="w-96">
              {data.top_diseases.length > 0 ? (
                <Pie data={pieData} options={{ responsive: true }} />
              ) : (
                <p className="text-gray-500 text-center py-8">No disease data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Predictions Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-700 to-blue-600">
            <h2 className="text-2xl font-bold text-white">
              Recent Predictions
            </h2>
          </div>

          {data.recent.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No recent predictions
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">Disease</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">Confidence</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">Severity</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">Priority</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((x, idx) => (
                  <tr key={x.id} className={`border-t ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                    <td className="px-8 py-4 font-semibold text-blue-600">{x.predicted_disease}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-300 h-2 rounded-full">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${x.confidence}%` }}
                          />
                        </div>
                        <span className="font-semibold text-sm">{x.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        x.severity === "High" ? "bg-red-100 text-red-600" :
                        x.severity === "Moderate" ? "bg-yellow-100 text-yellow-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {x.severity}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-orange-600 font-semibold">{x.doctor_priority}</td>
                    <td className="px-8 py-4 text-gray-600 text-sm">
                      {new Date(x.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
