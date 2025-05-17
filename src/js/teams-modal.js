import { capitalize, formatDate, getPlayerById, logout } from './utils.js';

const session = JSON.parse(window.localStorage.getItem('@court-connect:session'))

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
    <a href="./login.html" class="login-link">Entrar</a>
  `;
}

export function populateTeamDetailsDialog(data) {
  const dialog = document.getElementById('details-dialog');

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

  const container = dialog.querySelector('.container--positions');

  renderPositionsFromStorage(data.id)

  const subscribeBtn = document.getElementById('submit-subscribe')

    subscribeBtn.addEventListener('click', () => {
    

      const selected = container.querySelector('input[name="position"]:checked');
      if (!selected) {
        alert("Selecione uma posição disponível.");
        return;
      }

      const session = JSON.parse(window.localStorage.getItem('@court-connect:session'))

      if(!session) {
        alert("Para se inscrever em alguma partida é necessário estar logado!");
        return window.location.href = "login.html"
      }

      const selectedPosition = selected.value;
      const success = assignPlayerToPosition(String(data.id), selectedPosition);

      if (success) {
        alert(`Inscrição feita com sucesso para a posição "${selectedPosition}".`);
        dialog.close();
      } else {
        alert("Erro: não foi possível se inscrever. Verifique se a posição está disponível ou se você já está neste time.");
      }
    })


  dialog.showModal();
  attachPositionListeners()
}

function renderPositionsFromStorage(teamId) {
  const dialog = document.getElementById('details-dialog');
  const container = dialog.querySelector('.container--positions');
  container.innerHTML = '';

  const stored = JSON.parse(localStorage.getItem('@court-connect:teams')) || { teams: {} };
  const teamPositions = stored.teams?.[teamId];

  if (!teamPositions) {
    return;
  }

  Object.entries(teamPositions).forEach(([position, playerId], index) => {
    const id = `uuid${index + 1}`;
    const isAvailable = playerId === null;

    const label = document.createElement('label');
    label.className = 'position';
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.className = 'position__radio';
    input.type = 'radio';
    input.name = 'position';
    input.value = position;
    input.id = id;

    if (!isAvailable) input.disabled = true;

    const content = document.createElement('div');
    content.className = 'content';

    const strong = document.createElement('strong');
    strong.textContent = capitalize(position);

    const statusP = document.createElement('p');
    statusP.textContent = `Status: ${isAvailable ? 'Disponível' : 'Indisponível'}`;
    content.appendChild(strong);
    content.appendChild(statusP);

    if (!isAvailable) {
      const player = getPlayerById(playerId);
      const playerP = document.createElement('p');
      playerP.className = 'jogador';
      playerP.textContent = `Jogador: ${player ? player.name : 'Desconhecido'}`;
      content.appendChild(playerP);
    }

    label.appendChild(input);
    label.appendChild(content);
    container.appendChild(label);
  });
}

function attachPositionListeners() {
  const radios = document.querySelectorAll('input[name="position"]');
  const currentPosDiv = document.querySelector('.current-position div');
  const linkSpan = document.querySelector('.current-position span a');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const label = radio.closest('label');
      const positionName = label.querySelector('strong').textContent;

      currentPosDiv.innerHTML = `<span>Posição:</span> ${positionName}`;
      linkSpan.textContent = positionName.toLowerCase();
      linkSpan.href = `#${positionName.toLowerCase()}`; // You can customize this URL logic
    });
  });
}

function assignPlayerToPosition(teamId, position) {
  const localData  = JSON.parse(localStorage.getItem("@court-connect:teams")) || { teams: {} }
  const user = JSON.parse(localStorage.getItem("@court-connect:session")) || null

  if (!localData .teams[teamId]) {
    return false;
  }

  const teamPositions = localData .teams[teamId];

  if (teamPositions[position] !== null) { 
    return false;
  }

  const isPlayerAlreadyInTeam = Object.values(teamPositions).includes(user.id);

  if (isPlayerAlreadyInTeam) {
    return false;
  }

  const updatedData = {
    ...localData,
    teams: {
      ...localData.teams,
      [teamId]: {
        ...localData.teams[teamId],
        [position]: user.id
      }
    }
  }

  localStorage.setItem("@court-connect:teams", JSON.stringify(updatedData));

  return true;
}




