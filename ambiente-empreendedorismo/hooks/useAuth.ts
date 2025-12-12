"use client";

import { useEffect, useState } from "react";

interface MeResponse {
  isLogged: boolean;
  role: string | null;
}

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        setIsLogged(data.isLogged);
        setRole(data.role);
        setLoading(false);
      })
      .catch(() => {
        setIsLogged(false);
        setRole(null);
        setLoading(false);
      });
  }, []);

  return { loading, isLogged, role };
}