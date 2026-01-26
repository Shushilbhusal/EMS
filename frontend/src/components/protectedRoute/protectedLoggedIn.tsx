import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/employees", { replace: true });
    }
  }, [token, navigate]);

  if (token) return null;

  return <>{children}</>;
};

export default RedirectIfLoggedIn;
