import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

export default function Result() {
  const data = JSON.parse(localStorage.getItem("result"));

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-600">No Result Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const confidenceColor = data.confidence >= 80 ? "bg-green-500" : data.confidence >= 60 ? "bg-yellow-500" : "bg-red-500";
  const severityColor = 
    data.severity === "High" ? "text-red-600" :
    data.severity === "Moderate" ? "text-yellow-600" :
    "text-green-600";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          🔍 Prediction Result
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Disease Info */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Disease Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Predicted Disease</p>
                <p className="text-2xl font-bold text-blue-600">{data.disease}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${confidenceColor} transition-all duration-500`}
                      style={{ width: `${data.confidence}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{data.confidence}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Severity Level</p>
                <p className={`text-xl font-bold ${severityColor}`}>
                  {data.severity}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Medical Priority</p>
                <p className="text-lg font-semibold text-orange-600">
                  {data.doctor_priority}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Heatmap */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              AI Heatmap
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Shows which regions the model focused on
            </p>
            {data.heatmap_url ? (
              <img
                src={`${API_BASE_URL}${data.heatmap_url}`}
                alt="AI Heatmap"
                className="w-full rounded-lg shadow border border-gray-200"
              />
            ) : (
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Heatmap processing...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            🧠 Processing Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.original_url && (
              <div className="border rounded-xl overflow-hidden">
                <p className="bg-blue-50 text-blue-700 px-3 py-2 font-semibold">
                  Original / Resized
                </p>
                <img
                  src={`${API_BASE_URL}${data.original_url}`}
                  alt="Original preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            {data.processed_url && (
              <div className="border rounded-xl overflow-hidden">
                <p className="bg-blue-50 text-blue-700 px-3 py-2 font-semibold">
                  Preprocessed Image
                </p>
                <img
                  src={`${API_BASE_URL}${data.processed_url}`}
                  alt="Preprocessed preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            {data.augmented_url && (
              <div className="border rounded-xl overflow-hidden">
                <p className="bg-blue-50 text-blue-700 px-3 py-2 font-semibold">
                  Augmented Preview
                </p>
                <img
                  src={`${API_BASE_URL}${data.augmented_url}`}
                  alt="Augmented preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Treatment Recommendations */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            💊 Treatment Recommendations
          </h2>
          <ul className="space-y-2">
            {data.treatment.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Analyze Another
          </Link>
          <Link
            to="/history"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            View History
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
