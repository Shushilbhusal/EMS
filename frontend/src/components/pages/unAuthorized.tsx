import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-red-600">403</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>

        {/* Description */}
        <p className="mt-3 text-gray-600">
          You don’t have permission to access this page. Please contact the
          administrator if you think this is a mistake.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
