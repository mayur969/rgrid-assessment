export const apiEndpoints = {
  auth: {
    adminLogin: "/admin/login",
  },

  polls: {
    getAllPolls: "/polls",
    getActivePolls: "/polls?status=active",
    getPollById: "/polls/:id",
    createPoll: "/polls",
    endPoll: "/polls/:id/end",
  },

  votes: {
    submitVote: "/votes",
  },
};
