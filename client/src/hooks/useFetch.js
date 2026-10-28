import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        const headers = token ? { "auth-token": token } : {};

        const response = await axios.get(url, { headers });
        if (isMounted) {
          setResData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { resData, loading, error };
};

export default useFetch;
