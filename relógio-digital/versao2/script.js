const state = {
    is24h: JSON.parse(localStorage.getItem('clock:is24h') ?? 'false'),
    timeZone: localStorage.getItem('clock:timeZone') || 'local',
    theme: localStorage.getItem('clock:theme') || 'dark',
};

const TIMEZONES = [
    { value: 'local', label: 'Local (automático)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'America/New_York', label: 'Nova York (ET)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
    { value: 'Europe/Lisbon', label: 'Lisboa (WET)' },
    { value: 'Europe/London', label: 'Londres (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (JST)' },
    { value: 'Asia/Shanghai', label: 'Xangai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'UTC', label: 'UTC' },
];

const $time = document.getElementById('time');
const $ampm = document.getElementById('ampm');
const $date = document.getElementById('date');
const $formatToggle = document.getElementById('format-toggle');
const $formatLabel = document.getElementById('format-label');
const $timezoneSelect = document.getElementById('timezone-select');
const $themeToggle = document.getElementById('theme-toggle');
const $themeIcon = document.getElementById('theme-icon');

function initTimezoneSelect() {
    TIMEZONES.forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        $timezoneSelect.appendChild(option);
    });
    $timezoneSelect.value = state.timeZone;
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    $themeIcon.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function applyFormatLabel() {
    $formatLabel.textContent = state.is24h ? '24h' : '12h';
    $ampm.style.display = state.is24h ? 'none' : 'inline';
}

function resolvedTimeZone() {
    return state.timeZone === 'local' ? undefined : state.timeZone;
}

function updateClock() {
    const now = new Date();
    const timeZone = resolvedTimeZone();

    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !state.is24h,
    });

    const parts = timeFormatter.formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value ?? '00';

    let hourValue = get('hour');
    if (!state.is24h && hourValue === '24') hourValue = '12';

    $time.textContent = `${hourValue.padStart(2, '0')}:${get('minute')}:${get('second')}`;

    if (!state.is24h) {
        const dayPeriod = get('dayPeriod')?.toUpperCase() ?? '';
        $ampm.textContent = dayPeriod.includes('P') ? 'PM' : 'AM';
    }

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone,
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    $date.textContent = dateFormatter.format(now);
}

function scheduleNextTick() {
    const delay = 1000 - (Date.now() % 1000);
    setTimeout(() => {
        updateClock();
        scheduleNextTick();
    }, delay);
}

$formatToggle.addEventListener('click', () => {
    state.is24h = !state.is24h;
    localStorage.setItem('clock:is24h', JSON.stringify(state.is24h));
    applyFormatLabel();
    updateClock();
});

$timezoneSelect.addEventListener('change', (event) => {
    state.timeZone = event.target.value;
    localStorage.setItem('clock:timeZone', state.timeZone);
    updateClock();
});

$themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('clock:theme', state.theme);
    applyTheme();
});

initTimezoneSelect();
applyTheme();
applyFormatLabel();
updateClock();
scheduleNextTick();