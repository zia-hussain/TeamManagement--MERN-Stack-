import React, { useState } from "react";
import { ref, set, getDatabase } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../../redux/features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchUserName } from "../../redux/actions/action";
import { toast } from "react-toastify";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";

const CreateTeamForm = ({ darkMode }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.users);
  const [teamName, setTeamName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [questions, setQuestions] = useState([{ id: Date.now(), text: "" }]);
  const categories = ["Marketing", "Sales", "Development", "Design"];

  const handleCreateTeam = async () => {
    // Validate inputs
    if (
      !teamName ||
      !selectedCategory ||
      selectedUsers.length === 0 ||
      questions.some((q) => q.text.trim() === "")
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const db = getDatabase();
    const newTeamRef = ref(db, "teams/" + Date.now());

    try {
      // Fetch user names for selected users
      const memberDetails = await Promise.all(
        selectedUsers.map(async (userId) => {
          try {
            const name = await fetchUserName(userId);
            return { id: userId, name };
          } catch (error) {
            console.error(`Failed to fetch name for user ID ${userId}:`, error);
            return { id: userId, name: "Unknown" };
          }
        })
      );

      const members = memberDetails.reduce((acc, member) => {
        acc[member.id] = { name: member.name, answers: {} };
        return acc;
      }, {});
      let author = localStorage.getItem("currentUser");
      // Setting new team data to Firebase
      await set(newTeamRef, {
        name: teamName,
        author: author,
        category: selectedCategory,
        members,
        questions: questions.map((q) => q.text),
      });
      toast.success("Team has been successfully added!");
      dispatch(selectUsers(selectedUsers));
      resetFormFields();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setTeamName("");
    setSelectedCategory("");
    setSelectedUsers([]);
    dispatch(selectUsers([]));
    setFilter("");
    setQuestions([{ id: Date.now(), text: "" }]);
  };

  const handleUserSelection = (newValue) => {
    const updatedSelection = newValue.map((user) => user.id);
    setSelectedUsers(updatedSelection);
    dispatch(selectUsers(updatedSelection));
  };

  const handleQuestionChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <>
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-8 w-[95vw] md:max-w-lg shadow-lg`}
      >
        <h2 className="text-4xl font-bold mb-6">Create a New Team</h2>

        {/* 58 Lines od code */}
        <div className="mb-6">
          <label
            className={`${
              darkMode ? "text-gray-300" : "text-gray-800"
            } block mb-2`}
          >
            Select Team Category
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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

        {/* 19 Lines of code  */}
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

        {/* 79 Lines of code  */}
        <div className="mb-6">
          <label
            className={`${
              darkMode ? "text-gray-300" : "text-gray-800"
            } block mb-2`}
          >
            Add Members
          </label>
          <Autocomplete
            multiple
            id="add-members-autocomplete"
            options={users}
            getOptionLabel={(option) => option.name || ""}
            filterSelectedOptions
            value={users.filter((user) => selectedUsers.includes(user.id))}
            onChange={(event, newValue) => handleUserSelection(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search and select users"
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

        {/* 48 Lines of code  */}
        <div className="mb-6">
          <label
            className={`${
              darkMode ? "text-gray-300" : "text-gray-800"
            } block mb-2`}
          >
            Questions
          </label>
          {questions.map((question) => (
            <div key={question.id} className="flex items-center mb-3">
              <input
                type="text"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(question.id, e.target.value)
                }
                placeholder="Enter your question"
                className={`flex-1 p-4 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-400"
                } rounded mr-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              />
              <button
                type="button"
                onClick={() => handleRemoveQuestion(question.id)}
                className={`p-4 rounded ${
                  darkMode
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-600 hover:bg-red-700"
                } transition duration-200`}
              >
                <FontAwesomeIcon width={20} icon={faTrash} color="#fff" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className={`w-full p-3 rounded text-white ${
              darkMode
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200`}
          >
            <FontAwesomeIcon width={20} icon={faPlus} />
            <span className="ml-2">Add Question</span>
          </button>
        </div>

        <button
          onClick={handleCreateTeam}
          className={`w-full py-3 px-6 rounded text-white font-medium text-lg tracking-wider shadow-md transition duration-200 ease-out transform active:scale-95 ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-500/50"
              : "bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-700/50"
          }`}
        >
          Create Team
        </button>
      </div>
    </>
  );
};

export default CreateTeamForm;
