import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const imageBaseUrl = import.meta.env.VITE_TMDB_iMAGE_BASE_URL

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      console.log('Checking admin status...');
      const token = await getToken();
      console.log('Got auth token:', token ? 'Yes' : 'No');
      
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Admin check response:', data);
      setIsAdmin(data.success && data.isAdmin);
      
    } catch (error) {
      console.error('Admin check error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsAdmin(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User detected, checking metadata:', user.privateMetadata);
      fetchIsAdmin();
      fetchFavoriteMovies();
    } else {
      console.log('No user detected');
      setIsAdmin(false);
    }
  }, [user, location.pathname]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    imageBaseUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
