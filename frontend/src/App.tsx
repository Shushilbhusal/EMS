import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/pages/home";
import Navbar from "./components/pages/navbar";
import LoginPage from "./components/auth/Login";
import SignUpPage from "./components/auth/Signup";
import Employee from "./components/Employees/employee";
import IsLoggedIn from "./components/protectedRoute/isLoggedIn";
import VerifyEmail from "./components/auth/verifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    // add multiple elements here
    element: (
      <>
        <Navbar />
        <Home />
      </>
    )
  },

  {
    path: '/login',
    element: <LoginPage />
  }
,
  {
    path:"/signup",
    element: <SignUpPage />
  },

  {
    path: '/employees',
    element: (
      <>
       <IsLoggedIn>
        <Navbar />
        <Employee />
        </IsLoggedIn>
      </>
    )
  }
  ,

  {
    path:"verify-email",
    element: <VerifyEmail/>
  }

]);

function App() {
  return (
    <RouterProvider router={router} />  // Just this
  );
}

export default App;
