import { AuthProvider } from "./contexts/authContext";
import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import NotFoundPage from "./page/NotFoundPage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="sign-in" element={<SignInPage />}></Route>
          <Route path="sign-up" element={<SignUpPage />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
