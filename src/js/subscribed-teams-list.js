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

const positionSelect = document.querySelector('.position-filter');
positionSelect.addEventListener('change', () => {
  appendPlayerTeamsToTable(session.id, searchInput.value, positionSelect.value);
});

const statusRadios = document.querySelectorAll('input[name="statusFilter"]');

statusRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const selectedStatus = radio.value;

    appendPlayerTeamsToTable(session.id, searchInput.value, positionSelect.value, selectedStatus);
  });
});


function updateStatusCounts(playerId, filter = '', position = 'all') {
  const allTeams = getTeamsDataByPlayerId(playerId);

  console.log(playerId)
  console.log(filter)
  console.log(position)

  const filteredTeams = allTeams.filter(team => {
    const matchesName = team.team_name.toLowerCase().includes(filter.toLowerCase());
    const matchesPosition = position.toLowerCase() === 'all' || getPlayerPosition(team.id, playerId).toLowerCase() === position.toLowerCase();
    return matchesName && matchesPosition;
  });

  const allCount = filteredTeams.length;
  const availableCount = filteredTeams.filter(team => team.status === 'available').length;
  const unavailableCount = filteredTeams.filter(team => team.status === 'unavailable').length;

  document.getElementById('all-label').textContent = allCount;
  document.getElementById('available-label').textContent = availableCount;
  document.getElementById('unavailable-label').textContent = unavailableCount;
}


searchInput.addEventListener('input', () => {
  appendPlayerTeamsToTable(session.id, searchInput.value, positionSelect.value, selectedStatus);
  updateStatusCounts(session.id, searchInput.value, positionSelect.value);
});

positionSelect.addEventListener('change', () => {
  appendPlayerTeamsToTable(session.id, searchInput.value, positionSelect.value, selectedStatus);
  updateStatusCounts(session.id, searchInput.value, positionSelect.value);
});

let selectedStatus

statusRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    selectedStatus = radio.value;
    appendPlayerTeamsToTable(session.id, searchInput.value, positionSelect.value, selectedStatus);
    updateStatusCounts(session.id, searchInput.value, positionSelect.value);
  });
});



function appendPlayerTeamsToTable(playerId, filter = '', position = 'all', status = 'all') {
  const tbody = document.querySelector('.subscriptions__table tbody');
  const allTeams = getTeamsDataByPlayerId(playerId);

  const filteredTeams = allTeams.filter(team => {
    const matchesName = team.team_name.toLowerCase().includes(filter.toLowerCase());
    const matchesPosition = position.toLowerCase() === 'all' || getPlayerPosition(team.id, playerId).toLowerCase() === position.toLowerCase();
    const matchesStatus = status === 'all' || team.status === status;

    return matchesName && matchesPosition && matchesStatus;
  });

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
updateStatusCounts(session.id);
