import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers, fetchUsers } from "../../redux/features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DarkModeToggle from "@mui/icons-material/Brightness4";
import LightModeToggle from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../Modals/LogoutModal";
import { logout } from "../../redux/features/authSlice";
import { toggleDarkMode } from "../../redux/features/themeSlice";
import CreateTeamForm from "../form/CreateTeamForm";

const ManageTeams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const handleToggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  useEffect(() => {
    const fetchUser = async () => {
      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        const usersList = [];
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.role === "user") {
            usersList.push({ id: childSnapshot.key, ...userData });
          }
        });
        dispatch(fetchUsers())
          .then((res) => {
            console.log(res, "res @!@");
          })
          .catch((err) => {
            console.log(err, "err @!@");
          });
        dispatch(selectUsers(usersList));
      });
    };

    fetchUser();
  }, [dispatch]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-5`}
    >
      <div className="flex items-center justify-between w-full">
        <button
          className={`hidden lg:flex items-center ${
            darkMode
              ? "text-blue-400 hover:text-blue-500"
              : "text-blue-600 hover:text-blue-800"
          } transition duration-200`}
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>

        <div className="flex lg:justify-end justify-between items-center w-full">
          <div className="cursor-pointer" onClick={handleToggleTheme}>
            {darkMode ? <LightModeToggle /> : <DarkModeToggle />}
          </div>

          <button
            className={`ml-4 px-3 py-2 ${
              darkMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-semibold rounded`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-4 mb-2 lg:mt-10 flex flex-col items-center justify-center">
        <h1
          className={`mt-4 h-14 lg:mt-0 text-5xl font-extrabold mb-2 bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent`}
        >
          Create Teams
        </h1>

        <p
          className={`${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mt-2 mb-8 text-center`}
        >
          Create and manage your teams below.
        </p>

        <CreateTeamForm darkMode={darkMode} />
      </div>

      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </div>
  );
};

export default ManageTeams;
