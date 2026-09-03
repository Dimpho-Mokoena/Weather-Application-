const CONDITION_LABEL = { clear: 'Clear sky', clouds: 'Cloudy', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm' };
const QUICK_CITIES = ['Pretoria', 'Johannesburg', 'Cape Town', 'London', 'Nairobi', 'New York', 'Tokyo'];

const FALLBACK = {
  pretoria: { name: 'Pretoria', country: 'South Africa', tempC: 26, feelsLikeC: 27, humidity: 38, pressure: 1016, windKmh: 13, condition: 'clear', tzOffsetSec: 7200, sunrise: '5:52 AM', sunset: '6:04 PM',
    forecast: [{ day: 'Thu', condition: 'clear', hiC: 28, loC: 15 }, { day: 'Fri', condition: 'clouds', hiC: 25, loC: 14 }, { day: 'Sat', condition: 'clouds', hiC: 24, loC: 13 }, { day: 'Sun', condition: 'clear', hiC: 27, loC: 14 }, { day: 'Mon', condition: 'clear', hiC: 27, loC: 15 }] },
  johannesburg: { name: 'Johannesburg', country: 'South Africa', tempC: 23, feelsLikeC: 23, humidity: 55, pressure: 1014, windKmh: 17, condition: 'storm', tzOffsetSec: 7200, sunrise: '5:50 AM', sunset: '6:02 PM',
    forecast: [{ day: 'Thu', condition: 'rain', hiC: 22, loC: 13 }, { day: 'Fri', condition: 'clouds', hiC: 23, loC: 12 }, { day: 'Sat', condition: 'clear', hiC: 25, loC: 12 }, { day: 'Sun', condition: 'storm', hiC: 23, loC: 13 }, { day: 'Mon', condition: 'clouds', hiC: 22, loC: 13 }] },
  'cape town': { name: 'Cape Town', country: 'South Africa', tempC: 24, feelsLikeC: 25, humidity: 48, pressure: 1018, windKmh: 27, condition: 'clear', tzOffsetSec: 7200, sunrise: '6:35 AM', sunset: '7:32 PM',
    forecast: [{ day: 'Thu', condition: 'clear', hiC: 26, loC: 18 }, { day: 'Fri', condition: 'clouds', hiC: 23, loC: 17 }, { day: 'Sat', condition: 'clouds', hiC: 22, loC: 16 }, { day: 'Sun', condition: 'clear', hiC: 24, loC: 16 }, { day: 'Mon', condition: 'clear', hiC: 25, loC: 17 }] },
  london: { name: 'London', country: 'United Kingdom', tempC: 14, feelsLikeC: 12, humidity: 82, pressure: 1013, windKmh: 19, condition: 'clouds', tzOffsetSec: 3600, sunrise: '6:12 AM', sunset: '7:48 PM',
    forecast: [{ day: 'Thu', condition: 'clouds', hiC: 15, loC: 10 }, { day: 'Fri', condition: 'clouds', hiC: 16, loC: 11 }, { day: 'Sat', condition: 'clear', hiC: 18, loC: 11 }, { day: 'Sun', condition: 'rain', hiC: 14, loC: 9 }, { day: 'Mon', condition: 'clouds', hiC: 15, loC: 10 }] },
  nairobi: { name: 'Nairobi', country: 'Kenya', tempC: 21, feelsLikeC: 21, humidity: 74, pressure: 1011, windKmh: 18, condition: 'storm', tzOffsetSec: 10800, sunrise: '6:24 AM', sunset: '6:38 PM',
    forecast: [{ day: 'Thu', condition: 'rain', hiC: 21, loC: 15 }, { day: 'Fri', condition: 'clouds', hiC: 23, loC: 15 }, { day: 'Sat', condition: 'clear', hiC: 25, loC: 14 }, { day: 'Sun', condition: 'storm', hiC: 22, loC: 15 }, { day: 'Mon', condition: 'clouds', hiC: 22, loC: 15 }] },
  'new york': { name: 'New York', country: 'United States', tempC: 9, feelsLikeC: 6, humidity: 64, pressure: 1021, windKmh: 23, condition: 'clouds', tzOffsetSec: -18000, sunrise: '6:44 AM', sunset: '6:52 PM',
    forecast: [{ day: 'Thu', condition: 'clear', hiC: 12, loC: 3 }, { day: 'Fri', condition: 'clear', hiC: 13, loC: 5 }, { day: 'Sat', condition: 'rain', hiC: 9, loC: 5 }, { day: 'Sun', condition: 'clouds', hiC: 8, loC: 2 }, { day: 'Mon', condition: 'clouds', hiC: 10, loC: 3 }] },
  tokyo: { name: 'Tokyo', country: 'Japan', tempC: 19, feelsLikeC: 20, humidity: 91, pressure: 1006, windKmh: 11, condition: 'rain', tzOffsetSec: 32400, sunrise: '5:28 AM', sunset: '6:02 PM',
    forecast: [{ day: 'Thu', condition: 'storm', hiC: 21, loC: 18 }, { day: 'Fri', condition: 'clouds', hiC: 22, loC: 18 }, { day: 'Sat', condition: 'clear', hiC: 24, loC: 18 }, { day: 'Sun', condition: 'clouds', hiC: 23, loC: 18 }, { day: 'Mon', condition: 'clouds', hiC: 22, loC: 17 }] },
};

function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function codeToCondition(code) {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3 || code === 45 || code === 48) return 'clouds';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'clouds';
}

function formatLocalTime(iso) {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return '';
  let h = parseInt(m[1], 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return h12 + ':' + m[2] + ' ' + ampm;
}

function dayPartFromHour(h) {
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}

function iconSVG(condition) {
  if (condition === 'clear') {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <g><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="24s" repeatCount="indefinite"></animateTransform>
        <g stroke="#e8b95c" stroke-width="4" stroke-linecap="round">
          <line x1="50" y1="14" x2="50" y2="24"></line><line x1="50" y1="76" x2="50" y2="86"></line>
          <line x1="14" y1="50" x2="24" y2="50"></line><line x1="76" y1="50" x2="86" y2="50"></line>
          <line x1="25" y1="25" x2="32" y2="32"></line><line x1="75" y1="25" x2="68" y2="32"></line>
          <line x1="25" y1="75" x2="32" y2="68"></line><line x1="75" y1="75" x2="68" y2="68"></line>
        </g></g>
      <circle cx="50" cy="50" r="16" fill="#f0c674"><animate attributeName="r" values="15;17;15" dur="3s" repeatCount="indefinite"></animate></circle>
    </svg>`;
  }
  if (condition === 'clouds') {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="38" cy="63" rx="24" ry="12" fill="#aab4c8" opacity="0.55"><animateTransform attributeName="transform" type="translate" values="-4 0;4 0;-4 0" dur="9s" repeatCount="indefinite"></animateTransform></ellipse>
      <path d="M28 62 a14 14 0 1 1 3 -27 a17 17 0 0 1 33 3 a13 13 0 1 1 2 26 z" fill="#c7cede"><animateTransform attributeName="transform" type="translate" values="0 0;5 0;0 0" dur="7s" repeatCount="indefinite"></animateTransform></path>
    </svg>`;
  }
  if (condition === 'rain') {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M28 55 a14 14 0 1 1 3 -25 a17 17 0 0 1 33 3 a13 13 0 1 1 2 24 z" fill="#9aa7c2"></path>
      <g stroke="#6fa8dc" stroke-width="4" stroke-linecap="round">
        <line x1="35" y1="68" x2="31" y2="86"><animate attributeName="opacity" values="1;0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate></line>
        <line x1="50" y1="68" x2="46" y2="86"><animate attributeName="opacity" values="1;0;1" dur="1s" begin="0.3s" repeatCount="indefinite"></animate></line>
        <line x1="65" y1="68" x2="61" y2="86"><animate attributeName="opacity" values="1;0;1" dur="1s" begin="0.6s" repeatCount="indefinite"></animate></line>
      </g></svg>`;
  }
  if (condition === 'snow') {
    return `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M28 55 a14 14 0 1 1 3 -25 a17 17 0 0 1 33 3 a13 13 0 1 1 2 24 z" fill="#c3cbdb"></path>
      <circle cx="36" cy="70" r="3" fill="#eef2f8"><animate attributeName="cy" values="68;88;68" dur="4s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="1;1;0" dur="4s" repeatCount="indefinite"></animate></circle>
      <circle cx="50" cy="68" r="3" fill="#eef2f8"><animate attributeName="cy" values="66;88;66" dur="4.5s" begin="1s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="1;1;0" dur="4.5s" begin="1s" repeatCount="indefinite"></animate></circle>
      <circle cx="64" cy="70" r="3" fill="#eef2f8"><animate attributeName="cy" values="68;88;68" dur="4.2s" begin="0.5s" repeatCount="indefinite"></animate><animate attributeName="opacity" values="1;1;0" dur="4.2s" begin="0.5s" repeatCount="indefinite"></animate></circle>
    </svg>`;
  }
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M26 52 a14 14 0 1 1 3 -25 a17 17 0 0 1 33 3 a13 13 0 1 1 2 24 z" fill="#7d84a0"></path>
    <polygon points="52,58 42,74 50,74 44,90 62,68 53,68 58,58" fill="#f0c674"><animate attributeName="opacity" values="1;1;0.2;1" dur="1.6s" repeatCount="indefinite"></animate></polygon>
    <g stroke="#6fa8dc" stroke-width="3" stroke-linecap="round" opacity="0.8">
      <line x1="30" y1="66" x2="27" y2="80"><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"></animate></line>
      <line x1="72" y1="66" x2="69" y2="80"><animate attributeName="opacity" values="1;0;1" dur="1.1s" begin="0.4s" repeatCount="indefinite"></animate></line>
    </g></svg>`;
}

const state = { query: 'Pretoria', cityData: null, loading: true, error: null, unit: 'C', dialogIndex: null };

const el = (id) => document.getElementById(id);

function toF(c) { return Math.round((c * 9) / 5 + 32); }
function convert(c) { return state.unit === 'C' ? Math.round(c) : toF(c); }

function useFallbackOrError(name) {
  const fb = FALLBACK[name.trim().toLowerCase()];
  if (fb) { state.loading = false; state.error = null; state.cityData = fb; }
  else { state.loading = false; state.error = name; }
  render();
}

async function fetchCity(name) {
  state.loading = true; state.error = null; state.query = name; render();
  try {
    const geoRes = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`, 7000);
    const geo = await geoRes.json();
    if (!geo.results || !geo.results.length) { useFallbackOrError(name); return; }
    const r = geo.results[0];
    const wRes = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${r.latitude}&longitude=${r.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=6`, 7000);
    const w = await wRes.json();
    const cur = w.current, daily = w.daily;
    const forecast = [];
    for (let i = 1; i < daily.time.length && forecast.length < 5; i++) {
      const d = new Date(daily.time[i] + 'T00:00:00');
      forecast.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), condition: codeToCondition(daily.weather_code[i]), hiC: daily.temperature_2m_max[i], loC: daily.temperature_2m_min[i] });
    }
    state.loading = false; state.error = null; state.dialogIndex = null;
    state.cityData = {
      name: r.name, country: r.country || '', tempC: cur.temperature_2m, feelsLikeC: cur.apparent_temperature,
      humidity: Math.round(cur.relative_humidity_2m), pressure: Math.round(cur.surface_pressure), windKmh: Math.round(cur.wind_speed_10m),
      condition: codeToCondition(cur.weather_code), tzOffsetSec: w.utc_offset_seconds || 0,
      sunrise: formatLocalTime(daily.sunrise[0]), sunset: formatLocalTime(daily.sunset[0]), forecast,
    };
    render();
  } catch (e) {
    useFallbackOrError(name);
  }
}

function cityLocalDate(cd) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + cd.tzOffsetSec * 1000);
}

function render() {
  el('toast').hidden = !state.error;
  if (state.error) el('toast').textContent = `Couldn't find "${state.error}" — check the spelling and try again.`;

  const cd = state.cityData;
  el('hero').hidden = !cd;
  el('forecast-section').hidden = !cd;
  el('loading').hidden = !!cd;
  if (state.loading && !cd) el('loading').textContent = `Loading weather for ${state.query}…`;
  el('updating-tag').hidden = !(state.loading && cd);

  if (!cd) return;

  const ld = cityLocalDate(cd);
  const daypart = dayPartFromHour(ld.getUTCHours());
  el('hero').dataset.daypart = daypart;

  el('city-name').textContent = cd.name;
  el('city-country').textContent = cd.country;
  el('hero-icon').innerHTML = iconSVG(cd.condition);
  el('temp-value').textContent = convert(cd.tempC) + '°';
  el('condition-label').textContent = CONDITION_LABEL[cd.condition];
  el('feels-like').textContent = convert(cd.feelsLikeC);
  el('time-str').textContent = ld.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'UTC' });
  el('date-str').textContent = ld.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  el('humidity-value').textContent = cd.humidity + '%';
  el('pressure-value').textContent = cd.pressure + ' hPa';
  el('wind-value').textContent = cd.windKmh + ' km/h';
  el('sunrise-value').textContent = cd.sunrise;
  el('sunset-value').textContent = cd.sunset;

  const unitC = el('unit-c'), unitF = el('unit-f');
  unitC.className = 'btn btn-icon ' + (state.unit === 'C' ? 'btn-primary' : 'btn-ghost');
  unitF.className = 'btn btn-icon ' + (state.unit === 'F' ? 'btn-primary' : 'btn-ghost');

  const grid = el('forecast-grid');
  grid.innerHTML = '';
  cd.forecast.forEach((d, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card forecast-card';
    card.style.animationDelay = (i * 80) + 'ms';
    card.innerHTML = `<div class="card-kicker">${d.day}</div><div class="forecast-icon">${iconSVG(d.condition)}</div><div class="forecast-temp"><strong>${convert(d.hiC)}°</strong> <span class="lo">${convert(d.loC)}°</span></div>`;
    card.addEventListener('click', () => openDialog(i));
    grid.appendChild(card);
  });
}

function openDialog(i) {
  const cd = state.cityData;
  const d = cd.forecast[i];
  el('dialog-title').textContent = `${d.day} in ${cd.name}`;
  el('dialog-icon').innerHTML = iconSVG(d.condition);
  el('dialog-temp').textContent = `${convert(d.hiC)}° / ${convert(d.loC)}°`;
  el('dialog-label').textContent = CONDITION_LABEL[d.condition];
  el('dialog-backdrop').hidden = false;
}
function closeDialog() { el('dialog-backdrop').hidden = true; }

function buildChips() {
  const wrap = el('city-chips');
  QUICK_CITIES.forEach((name) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag tag-outline city-chip';
    btn.textContent = name;
    btn.addEventListener('click', () => fetchCity(name));
    wrap.appendChild(btn);
  });
}

el('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = el('search-input');
  const q = input.value.trim();
  if (!q) return;
  fetchCity(q);
  input.value = '';
});
el('unit-c').addEventListener('click', () => { state.unit = 'C'; render(); });
el('unit-f').addEventListener('click', () => { state.unit = 'F'; render(); });
el('dialog-close').addEventListener('click', closeDialog);
el('dialog-backdrop').addEventListener('click', (e) => { if (e.target === el('dialog-backdrop')) closeDialog(); });

buildChips();
fetchCity('Pretoria');
setInterval(() => { if (state.cityData) render(); }, 1000);
