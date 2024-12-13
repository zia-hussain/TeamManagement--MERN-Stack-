import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import DetailModal from "../../Modals/DetailModal";
import { useDispatch } from "react-redux";
import { fetchTeamMembers } from "../../../redux/actions/action";
import { getDatabase, ref, remove } from "firebase/database";

const MyTeamsCard = ({ darkMode, team, memberCount }) => {
  const dispatch = useDispatch();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (team) => {
    setSelectedTeam(team);
    dispatch(fetchTeamMembers(team.id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeam(null);
  };

  const handleDeleteUser = async (teamId, memberId) => {
    const db = getDatabase();
    const memberRef = ref(db, `teams/${teamId}/members/${memberId}`);

    try {
      await remove(memberRef);

      setSelectedTeam((prevTeam) => {
        const updatedMembers = { ...prevTeam.members };
        delete updatedMembers[memberId];
        return {
          ...prevTeam,
          members: updatedMembers,
        };
      });
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <>
      <div
        onClick={() => handleOpen(team)}
        key={team.id}
        className={`relative md:min-h-72 w-[25vw] rounded-xl shadow-md p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer border-l-4 backdrop-blur-lg overflow-hidden group
          ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-blue-600"
              : "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-blue-500"
          }`}
      >
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none 
          ${
            darkMode
              ? "bg-gradient-to-tr from-gray-900/30 to-transparent"
              : "bg-gradient-to-tr from-gray-200/30 to-transparent"
          }
        `}
        />

        {/* Card Content */}
        <div className="relative h-full z-10">
          <h2
            className={`text-3xl capitalize font-bold tracking-wide mb-3
            ${darkMode ? "text-gray-200" : "text-gray-900"}
          `}
          >
            {team.name}
          </h2>
          <p
            className={`text-sm font-medium mb-4
            ${darkMode ? "text-gray-400" : "text-gray-600"}
          `}
          >
            <strong>Type:</strong> {team.category}
          </p>
          <p
            className={`absolute -bottom-16 right-2 text-end mt-auto text-9xl opacity-15 font-black tracking-tighter
            ${darkMode ? "text-gray-400" : "text-gray-700"}
          `}
          >
            {memberCount}
          </p>
        </div>

        {/* View Button */}
        <button
          className={`mt-4 w-1/2 relative z-10 px-5 py-2.5 text-sm font-medium rounded shadow transition-all
          ${
            darkMode
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }
        `}
          onClick={() => console.log("Go to Team Details")}
        >
          View Team
        </button>

        {/* Settings Button (Appears on Hover) */}
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all
      ${
        darkMode
          ? "bg-gray-700 text-white hover:bg-blue-500"
          : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
      }
    `}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </div>

      {open && (
        <DetailModal
          selectedTeam={selectedTeam}
          onCancel={handleClose}
          onDeleteUser={handleDeleteUser}
          theme={darkMode}
        />
      )}
    </>
  );
};

export default MyTeamsCard;
