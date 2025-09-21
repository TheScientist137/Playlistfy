import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { getAccessToken } from "../services/pkceAuth";

interface Props {
  children: React.ReactNode;
}

// COMPROBAR NECESIDAD Y MEJORAR

export default function RequireAuth({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await getAccessToken(); // Intenta refrescar si hace falta
        setAuthorized(true);
      } catch (error) {
        console.error("Token refresh failed", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) return <p>Checking auth...</p>;

  if (!authorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
