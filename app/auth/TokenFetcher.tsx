"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const TokenFetcher: React.FC = () => {
  const router = useRouter();
  // const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNavigation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crawler");
      if (!res.ok) {
        alert("Failed to fetch token URL.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.token) {
        // setToken(data.token);
        document.cookie = `ess_token=${encodeURIComponent(
          data.token
        )}; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.push("/");
      }
    } catch (error) {
      alert("An error occurred while fetching the token.");
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleNavigation();
  }, []);

  return (
    <div>
      <button onClick={handleNavigation} disabled={loading}>
        {loading ? "Loading..." : "Get Token"}
      </button>
      {/* {token && (
        <div>
          <strong>Token:</strong> {token}
        </div>
      )} */}
    </div>
  );
};

export default TokenFetcher;
