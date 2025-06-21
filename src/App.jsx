import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout";
import Dashbaord from "./pages/admin/Dashbaord";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import { useAppContext } from "./context/AppContext";
import { SignIn } from "@clerk/clerk-react";
import Loading from "./components/Loading";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const { user, isAdmin, fetchIsAdmin } = useAppContext();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user && isAdminRoute) {
        try {
          setIsCheckingAdmin(true);
          setError(null);
          await fetchIsAdmin();
        } catch (err) {
          setError(err.message);
          console.error('Error checking admin:', err);
        } finally {
          setIsCheckingAdmin(false);
        }
      } else {
        setIsCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, [user, isAdminRoute]);

  // Show error if there was a problem checking admin status
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">
          Error checking admin status: {error}
        </h1>
      </div>
    );
  }

  // First check if it's an admin route and user is not logged in
  if (isAdminRoute && !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <SignIn fallbackRedirectUrl={"/admin"} />
      </div>
    );
  }

  // Show loading while checking admin status
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-accent"></div>
      </div>
    );
  }

  // Then check if user is logged in but not admin
  if (isAdminRoute && !isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={"/admin"} />
              </div>
            )
          }
        >
          <Route index element={<Dashbaord />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
