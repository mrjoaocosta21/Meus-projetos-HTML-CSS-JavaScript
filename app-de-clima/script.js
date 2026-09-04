/* =========================================================
   CONFIGURAÇÃO
========================================================= */

// Coloque sua chave da OpenWeatherMap aqui.
const apiKey = "SEU_API_KEY_AQUI";

const weatherURL =
  "https://api.openweathermap.org/data/2.5/weather";


/* =========================================================
   ELEMENTOS DO DOM
========================================================= */

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const icon = document.getElementById("icon");
const statusMessage = document.getElementById("statusMessage");


/* =========================================================
   ESTADO DA INTERFACE
========================================================= */

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;

  searchBtn.classList.toggle("loading", isLoading);

  cityInput.disabled = isLoading;
}


function setStatus(message = "", type = "") {
  statusMessage.textContent = message;

  statusMessage.className = "status-message";

  if (type) {
    statusMessage.classList.add(type);
  }
}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function capitalize(text) {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}


function formatWindSpeed(speed) {
  /*
    A OpenWeatherMap retorna o vento em metros por segundo.
    Conversão:
    m/s × 3.6 = km/h
  */

  const kmh = speed * 3.6;

  return `${Math.round(kmh)} km/h`;
}


/* =========================================================
   ATUALIZAÇÃO DA INTERFACE
========================================================= */

function updateUI(data) {

  cityName.textContent = data.name;

  temp.textContent = Math.round(data.main.temp);

  desc.textContent = capitalize(
    data.weather[0].description
  );

  humidity.textContent =
    `${data.main.humidity}%`;

  wind.textContent =
    formatWindSpeed(data.wind.speed);

  const weatherIcon =
    data.weather[0].icon;

  icon.src =
    `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  icon.alt =
    capitalize(data.weather[0].description);

  setStatus(
    `Clima atualizado para ${data.name}.`,
    "success"
  );
}


/* =========================================================
   BUSCAR CLIMA
========================================================= */

async function getWeather(city) {

  if (!city) {
    setStatus(
      "Digite o nome de uma cidade.",
      "error"
    );

    cityInput.focus();

    return;
  }


  if (apiKey === "SEU_API_KEY_AQUI") {

    setStatus(
      "Configure sua chave da OpenWeatherMap no arquivo script.js.",
      "error"
    );

    return;
  }


  setLoading(true);

  setStatus("Buscando informações do clima...");


  try {

    const url =
      `${weatherURL}?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${apiKey}`;

    const response =
      await fetch(url);


    if (!response.ok) {

      if (response.status === 404) {
        throw new Error(
          "Cidade não encontrada. Verifique o nome e tente novamente."
        );
      }

      if (response.status === 401) {
        throw new Error(
          "Chave da API inválida ou não autorizada."
        );
      }

      if (response.status === 429) {
        throw new Error(
          "Limite de consultas da API atingido. Tente novamente mais tarde."
        );
      }

      throw new Error(
        "Não foi possível consultar o clima."
      );
    }


    const data =
      await response.json();


    updateUI(data);


  } catch (error) {

    console.error(
      "Erro ao consultar o clima:",
      error
    );

    setStatus(
      error.message ||
      "Ocorreu um erro ao buscar o clima.",
      "error"
    );


  } finally {

    setLoading(false);

  }
}


/* =========================================================
   FORMULÁRIO
========================================================= */

searchForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const city =
      cityInput.value.trim();

    getWeather(city);
  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

cityInput.focus();

