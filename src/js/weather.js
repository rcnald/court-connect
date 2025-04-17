const weatherDisplay = document.getElementById('weather-display');
const showWeather = document.getElementsByClassName('show-weather')

const dialog = document.getElementById('details-dialog')

Array.from(showWeather).forEach((button) => {
  button.removeEventListener('click', fetchWeather)
  button.addEventListener('click', fetchWeather)
})

async function fetchWeather() {
  const cityName = "sao paulo"

  const apiUrl = `https://goweather.herokuapp.com/weather/${encodeURIComponent(cityName)}`;

  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Falha na requisição HTTP (Status: ${response.status})`);
    }

    const data = await response.json();

    if (data && data.temperature) {
      weatherDisplay.innerHTML = `${data.temperature} - ${data.description}`;
    } else {
      throw new Error(`Não foi possível encontrar a previsão para "${cityName}". Verifique o nome da cidade.`);
    }

  } catch (error) {
    console.error("fetchWeather: Erro capturado:", error);
  }

  dialog.showModal()
}