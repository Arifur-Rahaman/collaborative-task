import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css'
import { colors } from './theme/colors';
import Landing from "./pages/Landing/Landing";
import { ConfigProvider } from "antd";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Landing/>
    ),
  },
  {
    path: "/signup",
    element: (
      <SignUp/>
    ),
  },
  {
    path: "/login",
    element: (
      <LogIn/>
    ),
  },
])

function App() {

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
        },
      }}
    >
      <RouterProvider router={router}/>
    </ConfigProvider>
  )
}

export default App
