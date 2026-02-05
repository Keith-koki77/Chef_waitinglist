import React, { useEffect, useState } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

const ProtectedRoute = ({ requiredRole }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [isAuthorized, setIsAuthorized] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // 1. Check if a session exists

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthorized(false);
        } else {
          // 2. Fetch the role from the profiles table

          const { data: profile, error } = await supabase

            .from("profiles")

            .select("role")

            .eq("id", session.user.id)

            .single();

          if (error || !profile) {
            console.error("Profile fetch error:", error);

            setIsAuthorized(false);
          } else {
            // 3. Verify if the role matches the requirement

            // If no requiredRole is passed, just being logged in is enough

            setIsAuthorized(!requiredRole || profile.role === requiredRole);
          }
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

  // Redirect to login if not authorized, but save the location they were trying to go to

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
