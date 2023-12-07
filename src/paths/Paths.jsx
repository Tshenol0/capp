import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Fallback from "../components/Fallback";
const LazyRegister = React.lazy(() => import("../pages/Register"));
const LazyNav = React.lazy(() => import("../pages/Nav"));
const LazyUsers = React.lazy(() => import("../pages/Users"));
const LazyProfile = React.lazy(() => import("../pages/Profile"));
const LazyChats = React.lazy(() => import("../pages/Chats"));
const LazyNopage = React.lazy(() => import("../pages/Nopage"));
const LazyMyprofile = React.lazy(() => import("../pages/Myprofile"));
const LazySettings = React.lazy(() => import("../pages/Settings"));
const LazyAuth = React.lazy(() => import("../components/RequireAuth"));

const Paths = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/register"
        element={
          <React.Suspense>
            <LazyRegister />
          </React.Suspense>
        }
      />

      <Route
        element={
          <React.Suspense>
            <LazyAuth />
          </React.Suspense>
        }
      >
        <Route
          path="/loggedin"
          element={
            <React.Suspense fallback={<Fallback />}>
              <LazyNav />
            </React.Suspense>
          }
        >
          <Route
            index
            element={
              <React.Suspense fallback={<Fallback />}>
                <LazyChats />
              </React.Suspense>
            }
          />
          <Route
            path="users"
            element={
              <React.Suspense fallback={<Fallback />}>
                <LazyUsers />
              </React.Suspense>
            }
          />
          <Route
            path="users/:userid"
            element={
              <React.Suspense fallback={<Fallback />}>
                <LazyProfile />
              </React.Suspense>
            }
          />
          <Route
            path="users/profile"
            element={
              <React.Suspense fallback={<Fallback />}>
                <LazyMyprofile />
              </React.Suspense>
            }
          />
          <Route
            path="users/settings"
            element={
              <React.Suspense fallback={<Fallback />}>
                <LazySettings />
              </React.Suspense>
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <React.Suspense>
            <LazyNopage />
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default Paths;
