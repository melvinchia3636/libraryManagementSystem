// client/src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import BookList from "./pages/BookList";
import ModifyBookForm from "./pages/ModifyBookForm";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { AuthProvider } from "./providers/AuthContext";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}
      <div className="w-full min-h-dvh flex flex-col bg-gray-50 text-gray-800">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<ModifyBookForm />} />
            <Route path="/modify/:id" element={<ModifyBookForm />} />
          </Route>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;
