import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css'
import { colors } from './theme/colors';
import Landing from "./pages/Landing/Landing";
import { ConfigProvider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Landing/>
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
