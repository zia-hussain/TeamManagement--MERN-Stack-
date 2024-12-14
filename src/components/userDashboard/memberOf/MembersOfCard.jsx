import { Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const MembersOfCard = ({ team, darkMode, memberCount }) => {
  const navigate = useNavigate();
  return (
    <Tooltip key={team.id} title={team.name} arrow>
      <div
        className={`relative md:min-h-72 w-[25vw] rounded-xl shadow-md p-6 flex flex-col justify-start transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer border-l-4 backdrop-blur-lg overflow-hidden
          ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-blue-600"
              : "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-blue-500"
          }`}
        onClick={() => navigate(`/teams/${team.id}`)}
      >
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none rounded-xl
            ${
              darkMode
                ? "bg-gradient-to-br from-transparent to-gray-900/20"
                : "bg-gradient-to-br from-transparent to-gray-200/20"
            }`}
        />

        {/* Team Name */}
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
          className={`absolute bottom-5 right-5 text-end mt-auto text-9xl opacity-15 font-black tracking-tighter
            ${darkMode ? "text-gray-400" : "text-gray-700"}
          `}
        >
          {memberCount}
        </p>
      </div>
    </Tooltip>
  );
};

export default MembersOfCard;
