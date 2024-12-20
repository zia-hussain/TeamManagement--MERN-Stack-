// reducer.js
import {
  FETCH_TEAMS,
  ADD_TEAM,
  DELETE_TEAM,
  ADD_MEMBER,
  DELETE_MEMBER,
  UPDATE_TEAM,
} from "./actions/actionTypes";
import { ADD_ANSWER } from "./actions/action";
import { FETCH_TEAM_DETAILS, UPDATE_TEAM_DETAILS } from "./actions/actionTypes";

const initialState = {
  teams: [],
  members: {},
  loading: false,
  error: null,
};

const teamsReducer = (state = initialState, action) => {
  const { teamId, memberId, answer } = action;
  const team = state.teams[teamId];

  switch (action.type) {
    case FETCH_TEAM_DETAILS:
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.payload.teamId]: action.payload.team,
        },
      };
    case UPDATE_TEAM_DETAILS:
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.payload.teamId]: {
            ...state.teams[action.payload.teamId],
            ...action.payload.updatedTeam,
          },
        },
      };
    case FETCH_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };
    case ADD_TEAM:
      return {
        ...state,
        teams: [...state.teams, action.payload],
      };
    case DELETE_TEAM:
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.payload),
      };
    case UPDATE_TEAM:
      return state.map((team) =>
        team.id === action.payload.teamId
          ? { ...team, ...action.payload }
          : team
      );
    case ADD_MEMBER:
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
                ...team,
                members: {
                  ...team.members,
                  [action.payload.memberId]: action.payload.member,
                },
              }
            : team
        ),
      };
    case DELETE_MEMBER:
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
                ...team,
                members: Object.keys(team.members)
                  .filter((id) => id !== action.payload.memberId)
                  .reduce((obj, id) => {
                    obj[id] = team.members[id];
                    return obj;
                  }, {}),
              }
            : team
        ),
      };
    case ADD_ANSWER:
      return {
        ...state,
        teams: {
          ...state.teams,
          [teamId]: {
            ...team,
            members: team.members.map((member) =>
              member.id === memberId
                ? { ...member, answers: [...(member.answers || []), answer] }
                : member
            ),
          },
        },
      };
    default:
      return state;
  }
};

export default teamsReducer;
