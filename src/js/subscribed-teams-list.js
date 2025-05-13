function findTeamsByPlayerId(playerId) {
  const data = JSON.parse(localStorage.getItem("teams"));
  const result = [];

  if (data && data.teams) {
    for (const [teamId, positions] of Object.entries(data.teams)) {
      const isInTeam = Object.values(positions).includes(playerId);
      if (isInTeam) {
        result.push(parseInt(teamId));
      }
    }
  }

  return result;
}