const session = JSON.parse(window.localStorage.getItem('@court-connect:session'))

if (!session) window.location.href = "home.html"

import { teams } from "./data/teams.js";
import { getPlayerById, logout } from "./utils.js";

const data = JSON.parse(localStorage.getItem("@court-connect:teams"));

const profileDiv = document.querySelector('.profile');

if (session) {
  profileDiv.innerHTML = `
    <span>Olá, <b><a href="./subscriptions.html">${getPlayerById(session.id).name}</a></b></span>
    <img src="../assets/profile.png" alt="">
    <button class="logout" id="logout">Sair</button>
  `;

  profileDiv.querySelector("#logout").addEventListener('click', () => {
    logout()
    window.location.href = './home.html'
  })

} else {
  profileDiv.innerHTML = `
    <a href="/login.html" class="login-link">Entrar</a>
  `;
}

function findTeamsByPlayerId(playerId) {
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

function getTeamsDataByPlayerId(playerId) {

  const teamIds = findTeamsByPlayerId(playerId);

  return teams.filter(team => teamIds.includes(team.id));
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(',', '');
}

function generateTableRow(team, playerId) {
  const position = getPlayerPosition(team.id, playerId);
  const statusClass = team.status === 'available' ? 'available' : 'closed';
  const statusText = team.status === 'available' ? 'Aberto' : 'Fechado';

  return `
    <tr>
      <td><a href="#">See more</a></td>
      <td>${team.team_name}</td>
      <td class="status ${statusClass}"><span class="status-dot"></span> ${statusText}</td>
      <td>${position}</td>
      <td>${formatDate(team.details.date)}</td>
    </tr>
  `;
}


function getPlayerPosition(teamId, playerId) {
  if (data && data.teams) {
    for (const [position, id] of Object.entries(data.teams[teamId])) {
      if (id === playerId) return position;
    }
  }

  return 'N/A';
}

const searchInput = document.querySelector('.team-name');
searchInput.addEventListener('input', () => {
  appendPlayerTeamsToTable(session.id, searchInput.value);
});


function appendPlayerTeamsToTable(playerId, filter = '') {
  const tbody = document.querySelector('.subscriptions__table tbody');
  const allTeams = getTeamsDataByPlayerId(playerId);

  const filteredTeams = allTeams.filter(team =>
    team.team_name.toLowerCase().includes(filter.toLowerCase())
  );

  tbody.innerHTML = '';

  if (filteredTeams.length === 0) {
    const emptyRow = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 1em;">Você não está inscrito em nenhuma partida</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', emptyRow);
    return;
  }

  filteredTeams.forEach(team => {
    const rowHTML = generateTableRow(team, playerId);
    tbody.insertAdjacentHTML('beforeend', rowHTML);
  });
}

appendPlayerTeamsToTable(session.id)
