import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/pages/home";
import Navbar from "./components/pages/navbar";
import LoginPage from "./components/auth/Login";
import SignUpPage from "./components/auth/Signup";
import Employee from "./components/Employees/employee";
import IsLoggedIn from "./components/protectedRoute/isLoggedIn";
import VerifyEmail from "./components/auth/verifyEmail";
import Unauthorized from "./components/pages/unAuthorized";
import RedirectIfLoggedIn from "./components/protectedRoute/protectedLoggedIn";

const router = createBrowserRouter([
  {
    path: "/",
    // add multiple elements here
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },

  {
    path: "/login",
    element: (
      <>
        <RedirectIfLoggedIn>
          <LoginPage />
        </RedirectIfLoggedIn>
      </>
    ),
  },
  {
    path: "/signup",
    element: <>
        <RedirectIfLoggedIn>
          <SignUpPage />
        </RedirectIfLoggedIn>
      </>,
  },

  {
    path: "/employees",
    element: (
      <>
        <IsLoggedIn>
          <Navbar />
          <Employee />
        </IsLoggedIn>
      </>
    ),
  },

  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },

  {
    path: "/403",
    element: <Unauthorized />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} /> // Just this
  );
}

export default App;
