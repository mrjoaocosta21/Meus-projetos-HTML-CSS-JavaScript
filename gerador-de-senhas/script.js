const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!-$^+";
const spaceChar = " ";

const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('length');
const lengthValueEl = document.getElementById('lengthValue');
const lowercaseCheckbox = document.getElementById('lowercase');
const uppercaseCheckbox = document.getElementById('uppercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeDuplicateCheckbox = document.getElementById('exc-duplicate');
const spacesCheckbox = document.getElementById('spaces');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const copyLabel = document.getElementById('copyLabel');
const statusEl = document.getElementById('status');
const lockEl = document.getElementById('lock');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

const optionCheckboxes = [
  lowercaseCheckbox,
  uppercaseCheckbox,
  numbersCheckbox,
  symbolsCheckbox,
  excludeDuplicateCheckbox,
  spacesCheckbox,
];

function getRandomChar(chars) {
  const index = Math.floor(Math.random() * chars.length);
  return chars[index];
}

function buildCharPool() {
  let pool = "";
  if (lowercaseCheckbox.checked) pool += lowercaseChars;
  if (uppercaseCheckbox.checked) pool += uppercaseChars;
  if (numbersCheckbox.checked) pool += numberChars;
  if (symbolsCheckbox.checked) pool += symbolChars;
  if (spacesCheckbox.checked) pool += spaceChar;
  return pool;
}

function uniqueCount(str) {
  return new Set(str).size;
}

function setStatus(text) {
  statusEl.textContent = text;
}

// Evita o loop infinito do código original: se "excluir duplicatas" estiver
// marcado, o tamanho pedido nunca pode passar da quantidade de caracteres
// únicos disponíveis no conjunto selecionado.
function clampLengthToPool() {
  const pool = buildCharPool();
  if (!excludeDuplicateCheckbox.checked || pool === "") return;

  const maxUnique = uniqueCount(pool);
  if (Number(lengthSlider.value) > maxUnique) {
    lengthSlider.value = maxUnique;
    lengthValueEl.textContent = maxUnique;
    setStatus(`Tamanho ajustado para ${maxUnique} (máximo sem repetir caracteres com as opções atuais).`);
  }
}

function estimateStrength(pool, length) {
  if (pool.length === 0 || length === 0) return { label: '—', level: 0 };

  const uniqueSize = uniqueCount(pool);
  const bits = Math.round(length * Math.log2(uniqueSize));

  if (bits < 35) return { label: 'Fraca', level: 1 };
  if (bits < 60) return { label: 'Razoável', level: 2 };
  if (bits < 80) return { label: 'Boa', level: 3 };
  return { label: 'Forte', level: 4 };
}

function updateStrengthUI(pool, length) {
  const { label, level } = estimateStrength(pool, length);
  strengthFill.style.width = `${level * 25}%`;
  strengthFill.dataset.level = level;
  strengthLabel.textContent = level === 0 ? '\u00A0' : `Força estimada: ${label}`;
}

function generatePassword() {
  const pool = buildCharPool();

  if (pool === "") {
    passwordInput.value = "";
    updateStrengthUI("", 0);
    lockEl.classList.remove('is-unlocked');
    copyBtn.disabled = true;
    setStatus('Selecione ao menos uma opção de caracteres.');
    return;
  }

  clampLengthToPool();
  const length = Number(lengthSlider.value);
  const excludeDuplicates = excludeDuplicateCheckbox.checked;

  let password = "";
  let attempts = 0;
  const maxAttempts = length * 200; // válvula de segurança extra

  while (password.length < length && attempts < maxAttempts) {
    attempts += 1;
    const char = getRandomChar(pool);
    if (excludeDuplicates && password.includes(char)) continue;
    password += char;
  }

  passwordInput.value = password;
  copyBtn.disabled = false;
  lockEl.classList.add('is-unlocked');
  updateStrengthUI(pool, password.length);
  setStatus('Senha gerada.');
}

async function copyPassword() {
  if (!passwordInput.value) return;

  try {
    await navigator.clipboard.writeText(passwordInput.value);
  } catch (err) {
    // Alternativa para navegadores sem suporte à Clipboard API
    passwordInput.removeAttribute('readonly');
    passwordInput.select();
    document.execCommand('copy');
    passwordInput.setAttribute('readonly', '');
  }

  copyLabel.textContent = 'Copiado';
  setStatus('Senha copiada para a área de transferência.');
  setTimeout(() => {
    copyLabel.textContent = 'Copiar';
  }, 2000);
}

lengthSlider.addEventListener('input', () => {
  lengthValueEl.textContent = lengthSlider.value;
});

optionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', clampLengthToPool);
});

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

// Estado inicial
copyBtn.disabled = true;
updateStrengthUI("", 0);