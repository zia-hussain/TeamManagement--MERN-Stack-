import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { ref, getDatabase, onValue } from "firebase/database";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LogoutModal from "../Modals/LogoutModal";
import AddIcon from "@mui/icons-material/Add";
import DarkModeToggle from "@mui/icons-material/Brightness4";
import LightModeToggle from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { toggleDarkMode } from "../../redux/features/themeSlice";
import { fetchTeams } from "../../redux/actions/action";
import MyTeamsCard from "./myteamsCard/MyTeamsCard";
import MembersOfCard from "./memberOf/MembersOfCard";
import NotFoundImg from "../../assets/notfound/404.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [memberTeams, setMemberTeams] = useState([]);
  const { teams } = useSelector((state) => state.teams);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredTeams, setFilteredTeams] = useState([]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  useEffect(() => {
    if (teams) {
      const userTeams = teams.filter(
        (team) => team.author === localStorage.getItem("currentUser")
      );
      setFilteredTeams(userTeams);
    }
  }, [teams, currentUser]);

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoading(false);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  const handleToggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  const fetchUsername = async (userId) => {
    const userNameRef = ref(getDatabase(), `users/${userId}/name`);
    onValue(userNameRef, (snapshot) => {
      const userData = snapshot.val();
      setUsername(userData || "Guest");
      setLoading(false);
    });
  };

  const fetchUserTeams = async (userId) => {
    const userTeamsRef = ref(getDatabase(), `teams`);

    // Fetch all teams
    onValue(userTeamsRef, (snapshot) => {
      const teamsData = snapshot.val() || {}; // Fetch all teams from the DB

      // Filter teams by checking if the current user is part of the team (as a member)
      const userTeams = Object.keys(teamsData)
        .filter((teamId) => {
          const team = teamsData[teamId];

          // Assuming each team has a 'members' field with userIds as keys
          const members = team.members;

          // Check if userId is in the team members
          if (members && Object.keys(members).includes(userId)) {
            return true; // If the user is part of the team
          }
          return false;
        })
        .map((teamId) => ({
          id: teamId,
          ...teamsData[teamId], // Include the team details
        }));

      setMemberTeams(userTeams); // Set the fetched teams for the UI
      setLoading(false); // Set loading to false once teams are fetched
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUsername(user.uid);
        fetchUserTeams(user.uid);
      } else {
        console.error("No user is currently logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(fetchTeams(dispatch));
  }, []);

  return (
    <div
      className={`p-5 min-h-screen w-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } transition duration-300`}
    >
      <div className="flex items-center justify-between border-b py-2 border-gray-600">
        <h1 className="text-2xl font-bold flex items-center">
          Welcome,{" "}
          {loading ? (
            <Skeleton
              variant="text"
              width={100}
              height={50}
              style={{
                display: "inline-block",
                backgroundColor: "rgba(107, 114, 128, 0.3)",
                marginLeft: "5px",
                marginRight: "2px",
              }}
            />
          ) : (
            username
          )}
          !
        </h1>

        <div className="flex items-center">
          <div className="cursor-pointer" onClick={handleToggleTheme}>
            {darkMode ? <LightModeToggle /> : <DarkModeToggle />}
          </div>

          <button
            className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between border-b border-gray-600 p-8">
        <h1 className="text-4xl font-bold flex items-center">My Teams</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 mx-auto">
          {/* Create Team Card */}
          <div
            className={`rounded-lg shadow-lg p-5 flex flex-col items-center justify-center transition-transform transform min-h-72 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-white border-gray-300 text-gray-600"
            }`}
            style={{ borderWidth: "1px" }}
          >
            <AddIcon
              style={{ fontSize: 50, color: darkMode ? "#3B82F6" : "#2563EB" }}
            />
            <h2
              className={`mt-2 text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Create Team
            </h2>
            <p className="text-center">
              Start a new team and become the leader!
            </p>
            <Link
              to={"/create-teams"}
              className={`mt-4 px-4 py-2 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } rounded flex items-center`}
            >
              Create Team
            </Link>
          </div>

          {loading ? (
            // Show loading skeletons
            [1, 2].map((index) => (
              <div
                key={index}
                className="md:min-h-[40vh] w-[25vw] bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-5 flex flex-col transition-transform transform"
              >
                <Skeleton
                  variant="text"
                  height={40}
                  width="60%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width="50%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
                <Skeleton
                  variant="text"
                  height={60}
                  width="80%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
              </div>
            ))
          ) : filteredTeams.length === 0 ? (
            <div className="flex items-start justify-center w-max">
              <div className="flex flex-col items-center justify-start max-w-lg p-6">
                <img
                  src={NotFoundImg}
                  alt="No Teams Illustration"
                  className="w-48 h-48 mb-6"
                />
                <h2 className="text-3xl font-semibold text-gray-300 mb-4 text-center">
                  No Teams Found
                </h2>
                <p className="text-gray-600 text-center">
                  It seems you’re not part of any team yet. Once you join or are
                  added to a team, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            filteredTeams.map((team) => {
              const memberCount = team.members
                ? Object.keys(team.members).length
                : 0;
              return (
                <MyTeamsCard
                  team={team}
                  key={team.id}
                  darkMode={darkMode}
                  memberCount={memberCount}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between border-b border-gray-600 p-8">
        <h1 className="text-4xl font-bold flex items-center">Member of</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mt-8 mx-auto">
          {/* Skeleton Loaders for Team Cards */}
          {loading ? (
            [1, 2, 3].map((index) => (
              <div
                key={index}
                className="md:min-h-[40vh] w-[25vw] bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-5 flex flex-col transition-transform transform"
              >
                <Skeleton
                  variant="text"
                  height={40}
                  width="60%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width="50%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
                <Skeleton
                  variant="text"
                  height={60}
                  width="80%"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                  }}
                />
              </div>
            ))
          ) : memberTeams.length === 0 ? (
            <div className="flex items-start justify-center w-[90vw]">
              <div className="flex flex-col items-center justify-start max-w-lg p-6">
                <img
                  src={NotFoundImg}
                  alt="No Teams Illustration"
                  className="w-48 h-48 mb-6"
                />
                <h2 className="text-3xl font-semibold text-gray-300 mb-4 text-center">
                  No Teams Found
                </h2>
                <p className="text-gray-600 text-center">
                  It seems you’re not part of any team yet. Once you join or are
                  added to a team, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            memberTeams.map((team) => {
              const memberCount = team.members
                ? Object.keys(team.members).length
                : 0;
              return (
                <MembersOfCard
                  team={team}
                  key={team.id}
                  darkMode={darkMode}
                  memberCount={memberCount}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </div>
  );
};

export default Dashboard;
