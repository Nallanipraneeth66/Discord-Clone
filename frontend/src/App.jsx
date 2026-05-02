import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Channel from "./pages/Channel";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUserContext } from "./context/UserContext";
import FriendChat from "./pages/FriendChat";
import Profile from "./pages/Profile";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { ToastContainer } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const { user } = useUserContext();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useUserContext();
  return user ? <Navigate to="/home" replace /> : <>{children}</>;
};

function App() {
  const { user, token} =
    useUserContext();
  const serverUrl = "wss://discord-clone2-k8nlwhsb.livekit.cloud";
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  return (
    <BrowserRouter>
      <ToastContainer />
      <LiveKitRoom
        video={false}
        audio={true}
        connect={!!user}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        <div className="flex">
          {user && (
            <Sidebar isAreaOpen={isAreaOpen} setIsAreaOpen={setIsAreaOpen} />
          )}
          <Routes>
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/channel/:id"
              element={
                <PrivateRoute>
                  <Channel
                    isAreaOpen={isAreaOpen}
                    setIsAreaOpen={setIsAreaOpen}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home isAreaOpen={isAreaOpen} setIsAreaOpen={setIsAreaOpen} />
                </PrivateRoute>
              }
            />
            <Route
              path="/friendchat/:id"
              element={
                <PrivateRoute>
                  <FriendChat
                    isAreaOpen={isAreaOpen}
                    setIsAreaOpen={setIsAreaOpen}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </LiveKitRoom>
    </BrowserRouter>
  );
}

export default App;
