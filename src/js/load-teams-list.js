import { teams } from "./data/teams.js";
import { populateTeamDetailsDialog } from "./teams-modal.js";

function saveTeamsToLocalStorage(teams) {
  const formatted = {};

  teams.forEach(team => {
    const teamId = team.id;
    formatted[teamId] = { ...team.positions };
  });

  const previousData = JSON.parse(localStorage.getItem("@court-connect:teams"))

  if (previousData) return

  localStorage.setItem("@court-connect:teams", JSON.stringify({ teams: formatted }));
}

document.addEventListener("DOMContentLoaded", () => {
  saveTeamsToLocalStorage(teams)

  const list = document.getElementById('team-list');

  teams.forEach(team => {
    const li = document.createElement('li');
    li.className = 'team show-weather';
    li.dataset.id = team.id;
    li.onclick = fetchWeather

    li.innerHTML = `
          <img src="../assets/team-photo-skeleton.jpg" alt="">
          <div class="team__container">
              <h1>${team.team_name}</h1>
          </div>
          <hr class="team__separator">
          <div class="team__status">
              <div class="circle">
                  <div class="dot"></div>
                  <div class="outline"></div>
              </div>
              ${team.status === 'available' ? 'disponível' : 'indisponível'}
          </div>
      `;

    list.appendChild(li);
  });

  document.querySelectorAll('.team').forEach(dotteam => {
    dotteam.addEventListener('click', () => {
      const teamId = parseInt(dotteam.dataset.id);
      const teamData = teams.find(team => team.id === teamId);
      if (teamData) populateTeamDetailsDialog(teamData);
    });
  });
});