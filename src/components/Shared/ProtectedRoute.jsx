import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const ProtectedRoute = ({ requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  // Master Admin definition
  const ADMIN_EMAIL = "bitebankdesk@gmail.com"; 

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthorized(false);
          return;
        }

        const user = session.user;
        const role = user?.user_metadata?.role;
        const userEmail = user?.email;

        // ✅ ADMIN OVERRIDE
        // If the route requires 'admin', check the email.
        // Otherwise, check the metadata role.
        if (requiredRole === 'admin') {
          setIsAuthorized(userEmail === ADMIN_EMAIL);
        } else {
          // Standard check for foodie/chef
          setIsAuthorized(!requiredRole || role === requiredRole);
        }

      } catch (err) {
        console.error("Auth verification failed:", err);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-[#DD3131] rounded-full animate-spin"></div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;