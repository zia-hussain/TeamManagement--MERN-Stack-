import {
  getDatabase,
  ref,
  onValue,
  remove,
  push,
  get,
  update, // We will use update here
} from "firebase/database";
import {
  FETCH_TEAMS,
  ADD_TEAM,
  DELETE_TEAM,
  ADD_MEMBER,
  DELETE_MEMBER,
  UPDATE_TEAM_DETAILS,
  UPDATE_TEAM,
  FETCH_TEAM_DETAILS,
} from "./actionTypes";

import { app } from "../../firebase/firebaseConfig";

export const fetchTeamDetails = (teamId) => async (dispatch) => {
  const db = getDatabase(app);
  const teamRef = ref(db, `teams/${teamId}`);

  try {
    const snapshot = await get(teamRef);
    const team = snapshot.val();
    if (team) {
      dispatch({
        type: FETCH_TEAM_DETAILS,
        payload: { teamId, team },
      });
    }
  } catch (error) {
    console.error("Error fetching team details:", error);
  }
};

export const updateTeamDetails = (teamId, updatedTeam) => async (dispatch) => {
  const db = getDatabase(app);
  const teamRef = ref(db, `teams/${teamId}`);

  try {
    await update(teamRef, updatedTeam);
    dispatch({
      type: UPDATE_TEAM_DETAILS,
      payload: { teamId, updatedTeam },
    });
  } catch (error) {
    console.error("Error updating team details:", error);
  }
};

export const fetchTeams = () => (dispatch) => {
  const db = getDatabase(app);
  const teamsRef = ref(db, "teams");

  onValue(teamsRef, (snapshot) => {
    const data = snapshot.val();
    const teamsList = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
    dispatch({
      type: FETCH_TEAMS,
      payload: teamsList,
    });
  });
};

export const addTeam = (team) => (dispatch) => {
  const db = getDatabase(app);
  const teamsRef = ref(db, "teams/");
  const newTeamRef = push(teamsRef);

  newTeamRef.set(team).then(() => {
    dispatch({
      type: ADD_TEAM,
      payload: { id: newTeamRef.key, ...team },
    });
  });
};

export const deleteTeam = (teamId) => (dispatch) => {
  const db = getDatabase(app);
  remove(ref(db, `teams/${teamId}`)).then(() => {
    dispatch({
      type: DELETE_TEAM,
      payload: teamId,
    });
  });
};

export const updateTeam = (teamId, updatedTeam) => (dispatch) => {
  const db = getDatabase(app);
  const teamRef = ref(db, `teams/${teamId}`);

  update(teamRef, updatedTeam)
    .then(() => {
      dispatch({
        type: UPDATE_TEAM,
        payload: { teamId, ...updatedTeam },
      });
    })
    .catch((error) => {
      console.error("Error updating team: ", error);
    });
};

export const fetchTeamMembers = (teamId) => async (dispatch) => {
  const db = getDatabase();
  const teamRef = ref(db, `teams/${teamId}/members`);

  try {
    const membersSnapshot = await get(teamRef);
    const members = membersSnapshot.val();

    if (members) {
      const userPromises = Object.keys(members).map(async (uid) => {
        const userRef = ref(db, `users/${uid}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();

        return {
          uid,
          name: userData ? userData.name : "Unknown",
        };
      });

      const membersWithDetails = await Promise.all(userPromises);

      dispatch({
        type: "FETCH_TEAM_MEMBERS_SUCCESS",
        payload: { teamId, members: membersWithDetails },
      });
    }
  } catch (error) {
    console.error("Error fetching team members: ", error);
    dispatch({ type: "FETCH_TEAM_MEMBERS_FAILURE", error });
  }
};

export const addMember = (teamId, member) => (dispatch) => {
  const db = getDatabase(app);
  const membersRef = ref(db, `teams/${teamId}/members/`);
  const newMemberRef = push(membersRef);

  newMemberRef.set(member).then(() => {
    dispatch({
      type: ADD_MEMBER,
      payload: { teamId, memberId: newMemberRef.key, member },
    });
  });
};

export const deleteMember = (teamId, memberId) => async (dispatch) => {
  const db = getDatabase(app);
  try {
    await remove(ref(db, `teams/${teamId}/members/${memberId}`));

    dispatch({
      type: DELETE_MEMBER,
      payload: { teamId, memberId },
    });
  } catch (error) {
    console.error("Error deleting member:", error);
  }
};

export const fetchUserName = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.name;
    } else {
      console.log("No data available for this user");
      return "No Name";
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return "Error";
  }
};

export const ADD_ANSWER = "ADD_ANSWER";

export const addAnswer = (teamId, memberId, answer) => ({
  type: ADD_ANSWER,
  payload: { teamId, memberId, answer },
});
