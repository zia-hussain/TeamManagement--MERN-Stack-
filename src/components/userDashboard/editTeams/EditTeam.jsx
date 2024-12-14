import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { fetchUsers } from "../../../redux/features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toggleDarkMode } from "../../../redux/features/themeSlice";
import {
  Skeleton,
  TextField,
  Autocomplete,
  MenuItem,
  Select,
} from "@mui/material";
import DarkModeToggle from "@mui/icons-material/Brightness4";
import LightModeToggle from "@mui/icons-material/Brightness7";
import CloseIcon from "@mui/icons-material/Close";
import LogoutModal from "../../Modals/LogoutModal";
import { logout } from "../../../redux/features/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UpdateTeam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const { teamId } = useParams();
  const [teamName, setTeamName] = useState("");
  const users = useSelector((state) => state.users.users);
  const [teamCategory, setTeamCategory] = useState("");
  const [members, setMembers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const categories = ["Marketing", "Sales", "Development", "Design"];

  useEffect(() => {
    const db = getDatabase();
    const teamRef = ref(db, `teams/${teamId}`);

    const unsubscribe = onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeamName(data.name || "");
        setTeamCategory(data.category || "");
        setMembers(
          Object.entries(data.members || {}).map(([id, member]) => ({
            id,
            ...member,
          }))
        );
        setQuestions(data.questions || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUpdateTeam = () => {
    if (!teamName || !teamCategory) {
      alert("Please fill in all required fields.");
      return;
    }

    const db = getDatabase();
    const teamRef = ref(db, `teams/${teamId}`);
    update(teamRef, {
      name: teamName,
      category: teamCategory,
      members: members.reduce(
        (acc, member) => ({ ...acc, [member.id]: member }),
        {}
      ),
      questions,
    })
      .then(() => alert("Team updated successfully!"))
      .catch((error) => alert("Error updating team: " + error.message));
  };

  const handleAddQuestion = () => {
    if (newQuestion) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    } else {
      alert("Please enter a valid question.");
    }
  };

  const handleRemoveQuestion = (index) =>
    setQuestions(questions.filter((_, i) => i !== index));

  const handleToggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login");
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
              ? "text-blue-400 hover:text-blue-600"
              : "text-blue-600 hover:text-blue-800"
          } transition duration-200`}
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>

        <div className="flex lg:justify-end justify-between items-center w-full float-end">
          <div className="cursor-pointer" onClick={handleToggleTheme}>
            {darkMode ? <LightModeToggle /> : <DarkModeToggle />}
          </div>

          <button
            className={`ml-4 px-3 py-2 font-semibold rounded text-white ${
              darkMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <h1 className="my-4 h-14 lg:mt-0 text-5xl font-extrabold mb-2 bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
        Update Team
      </h1>

      <div className="flex items-center justify-center mt-10">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTeam();
            }}
            className="space-y-6"
          >
            <div className="mb-6">
              <label
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-800"
                } block mb-2`}
              >
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className={`w-full p-4 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-400 hover:border-gray-700 focus:border-blue-500"
                } rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              />
            </div>

            <div className="mb-6">
              <label
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-800"
                } block mb-2`}
              >
                Select Team Category
              </label>
              <Select
                value={teamCategory}
                onChange={(e) => setTeamCategory(e.target.value)}
                displayEmpty
                className={`w-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-800"
                } rounded`}
                inputProps={{ "aria-label": "Select Team Category" }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                    },
                  },
                }}
                sx={{
                  "& .MuiSelect-icon": {
                    color: darkMode ? "#9CA3AF" : "#6B7280",
                  },
                  "& .Mui-selected": {
                    color: "#FFFFFF",
                    backgroundColor: darkMode ? "#4b5563" : "#E5E7EB",
                  },
                  color: darkMode ? "#fff" : "#1f2937",
                  backgroundColor: darkMode ? "#374151" : "#F3F4F6",
                }}
              >
                <MenuItem value="" disabled>
                  <p className={`${darkMode ? "text-gray-400" : ""}`}>
                    Choose a category
                  </p>
                </MenuItem>
                {categories.map((category, index) => (
                  <MenuItem
                    key={index}
                    value={category}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#E5E7EB",
                      },
                      color: "#000000",
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <label
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-800"
                } block mb-2`}
              >
                Members
              </label>
              <Autocomplete
                multiple
                id="add-members-autocomplete"
                options={users}
                getOptionLabel={(option) => option.name || ""}
                filterSelectedOptions
                value={members}
                onChange={(event, newValue) => setMembers(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search and select members"
                    variant="outlined"
                    className="w-full"
                    InputProps={{
                      ...params.InputProps,
                      className: `w-full p-3 ${
                        darkMode
                          ? "bg-gray-700 !text-white border-gray-600"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      } focus:ring-blue-500 focus:border-blue-500 rounded`,
                    }}
                    InputLabelProps={{
                      style: {
                        color: darkMode ? "#9CA3AF" : "#6B7280",
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#FFFFFF" : "#6B7280",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiInputBase-root": {
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    minHeight: "56px",
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: darkMode ? "#9CA3AF" : "#6B7280",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: darkMode ? "#9CA3AF" : "#6B7280",
                  },
                  "& .MuiAutocomplete-option": {
                    backgroundColor: darkMode ? "#374151" : "#FFFFFF",
                    color: darkMode ? "#FFFFFF" : "#1F2937",
                    "&:hover": {
                      backgroundColor: darkMode ? "#4B5563" : "#E5E7EB",
                    },
                    "&[aria-selected='true']": {
                      backgroundColor: darkMode ? "#4B5563" : "#E5E7EB",
                      color: darkMode ? "#FFFFFF" : "#1F2937",
                    },
                  },
                  "& .MuiChip-root": {
                    backgroundColor: darkMode ? "#4B5563" : "#E5E7EB",
                    color: darkMode ? "#FFFFFF" : "#1F2937",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: darkMode ? "#9CA3AF" : "#6B7280",
                    "&:hover": {
                      color: darkMode ? "#FFFFFF" : "#374151",
                    },
                  },
                }}
              />
            </div>

            <div
              className={`p-6 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Questions</h2>
              {questions?.map((question, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={question}
                    disabled
                    className={`flex-1 p-4 rounded border transition duration-200 ${
                      darkMode
                        ? "bg-gray-700 text-gray-400 placeholder-gray-400 border-gray-600"
                        : "bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-400"
                    }`}
                    placeholder="Question"
                  />
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className={`p-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    } hover:bg-gray-300 rounded-full`}
                  >
                    <CloseIcon className={`${darkMode ? "text-white" : ""}`} />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className={`flex-1 p-4 rounded border outline-none transition duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-gray-200 placeholder-white border-gray-500"
                      : "bg-gray-100 text-gray-800 placeholder-gray-900 border-gray-400"
                  } focus:!ring-blue-500 focus:border-blue-500 rounded`}
                  placeholder="Add Question"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className={`p-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ${
                    darkMode ? "border-gray-600" : "border-gray-400"
                  }`}
                >
                  Add Question
                </button>
              </div>
            </div>

            <button
              className={`w-full py-3 px-6 rounded text-white !text-lg tracking-wider shadow-md transition duration-200 ease-out transform active:scale-95 ${
                darkMode
                  ? "!bg-blue-600 hover:!bg-blue-500 focus:ring-4 focus:!ring-blue-500/50"
                  : "!bg-blue-700 hover:!bg-blue-600 focus:ring-4 focus:!ring-blue-700/50"
              }`}
              type="submit"
              color="success"
            >
              Update Team
            </button>
          </form>
        )}
      </div>
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </div>
  );
};

export default UpdateTeam;
