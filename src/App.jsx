import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import Dashboard from "./components/userDashboard/Dashboard";
import Login from "./components/auth/login/Login";
import Signup from "./components/auth/signup/Signup";
import PrivateRoute from "./components/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";
import ManageTeams from "./components/userDashboard/CreateTeam";
import TeamDetailPage from "./components/userDashboard/TeamDetailPage";
import "./App.css";
import EditTeam from "./components/userDashboard/editTeams/EditTeam";

const App = () => {
  return (
    <div className="hide-scrollbar">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teams/:teamId" element={<TeamDetailPage />} />

            <Route
              path="/"
              element={
                <PrivateRoute element={<Dashboard />} requiredRole="user" />
              }
            />
            <Route path="/create-teams" element={<ManageTeams />} />
            <Route path="/edit-team/:teamId" element={<EditTeam />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
          />
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
