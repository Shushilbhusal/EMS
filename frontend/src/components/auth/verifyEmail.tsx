/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasRun = useRef(false);      

  const [loading, setLoading] = useState(true);    
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setError(true);
      setMessage("Invalid verification link");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
          { params: { token } },
        );

        setMessage(res.data.message || "Email verified successfully");
        setError(false);

        setTimeout(() => navigate("/login"), 3000);
      } catch (err: any) {
        setError(true);
        setMessage(
          err.response?.data?.message || "Verification failed or expired",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        {loading ? (
          <p className="text-blue-600 font-semibold">Verifying your email...</p>
        ) : (
          <>
            <h2
              className={`text-xl font-bold ${
                error ? "text-red-600" : "text-green-600"
              }`}
            >
              {error ? "Verification Failed" : "Email Verified"}
            </h2>

            <p className="mt-4 text-gray-600">{message}</p>

            {!error && (
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to login...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
