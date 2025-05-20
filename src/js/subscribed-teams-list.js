const session = JSON.parse(window.localStorage.getItem('@court-connect:session'))

if (!session) window.location.href = "home.html"

import { teams } from "./data/teams.js";
import { capitalize, getPlayerById, logout } from "./utils.js";

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
  const data = JSON.parse(localStorage.getItem("@court-connect:teams"));

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
      <td><a class="sub-details" data-id="${team.id}">See more</a></td>
      <td>${team.team_name}</td>
      <td class="status ${statusClass}"><span class="status-dot"></span> ${statusText}</td>
      <td>${position}</td>
      <td>${formatDate(team.details.date)}</td>
    </tr>
  `;
}


function getPlayerPosition(teamId, playerId) {
  const data = JSON.parse(localStorage.getItem("@court-connect:teams"));

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

  document.querySelectorAll('.sub-details').forEach(dotsub => {
    dotsub.addEventListener('click', () => {
      const teamId = parseInt(dotsub.dataset.id);
      const teamData = teams.find(team => team.id === teamId);
      if (teamData) populateTeamDetailsDialogSub(teamData);
    });
  });
}

function populateTeamDetailsDialogSub(data) {
  
  const unsubscribeBtn = document.getElementById('submit-unsubscribe')

  const dialog = document.getElementById('details-dialog-sub');

  const statusSpan = dialog.querySelector('.status');
  statusSpan.textContent = data.status === 'available' ? 'disponível' : 'indisponível';
  statusSpan.dataset.status = data.status;

  dialog.querySelector('.head h1').textContent = data.team_name;
  dialog.querySelector('.coach').innerHTML = `<b>Treinador:</b> ${data.coach}`;

  const details = dialog.querySelectorAll('.details li span');
  details[0].textContent = formatDate(data.details.date);
  details[1].textContent = data.details.hour;
  details[2].textContent = data.details.address;
  details[3].textContent = "Indisponível";

  renderPositionsSubFromStorage(data.id, session.id)

  function handleUnsubscribeClick() {
    unsubscribePlayerFromTeam(data.id);

  }

  unsubscribeBtn.onclick = handleUnsubscribeClick

  dialog.showModal();
}

const unsubscribePlayerFromTeam = (teamId) => {

  const stored = JSON.parse(localStorage.getItem('@court-connect:teams')) || { teams: {} };
  const teamData = stored.teams[teamId];

  if (!teamData) {
    alert("Time não encontrado no localStorage.");
    return;
  }

  const playerPosition = Object.entries(teamData).find(
    ([, id]) => id === session.id
  );

  if (!playerPosition) {
    alert("Você não está inscrito em nenhuma posição desse time.");
    return;
  }

  const teamMeta = teams.find(team => team.id === teamId)
  if (!teamMeta) {
    alert("Metadados do time não encontrados.");
    return;
  }

  if (teamMeta.status !== 'available') {
    alert("Este time está indisponível para alterações no momento.");
    return;
  }
  const [position] = playerPosition;
  stored.teams[teamId][position] = null;

  localStorage.setItem('@court-connect:teams', JSON.stringify(stored));

  alert(`Você foi removido da posição "${position}" com sucesso.`);

  
  const dialog = document.getElementById('details-dialog-sub');

  appendPlayerTeamsToTable(session.id)
  updateStatusCounts(session.id);
  dialog.close()
};


function renderPositionsSubFromStorage(teamId, currentPlayerId) {
  const dialog = document.getElementById('details-dialog-sub');
  const container = dialog.querySelector('.team-details-sub .container--positions');
  container.innerHTML = '';

  const stored = JSON.parse(localStorage.getItem('@court-connect:teams')) || { teams: {} };
  const teamPositions = stored.teams?.[teamId];

  if (!teamPositions) return;

  Object.entries(teamPositions).forEach(([position, playerId]) => {
    const isAvailable = playerId === null;
    const isCurrentPlayer = playerId === currentPlayerId;

    let situation = 'available';
    if (isCurrentPlayer) {
      situation = 'selected';
    } else if (!isAvailable) {
      situation = 'unavailable';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'position-display';
    wrapper.dataset.situation = situation;

    const content = document.createElement('div');
    content.className = 'content';

    const strong = document.createElement('strong');
    strong.textContent = capitalize(position);

    const statusP = document.createElement('p');
    statusP.textContent = isCurrentPlayer ? '' : `Status: ${isAvailable ? 'Disponível' : 'Indisponível'}`;
    content.appendChild(strong);
    content.appendChild(statusP);

    if (!isAvailable) {
      const player = getPlayerById(playerId);
      const playerP = document.createElement('p');
      playerP.className = 'jogador';
      playerP.textContent = `Jogador: ${player ? player.name : 'Desconhecido'}`;
      content.appendChild(playerP);
    }

    wrapper.appendChild(content);
    container.appendChild(wrapper);
  });
}



appendPlayerTeamsToTable(session.id)
updateStatusCounts(session.id);

