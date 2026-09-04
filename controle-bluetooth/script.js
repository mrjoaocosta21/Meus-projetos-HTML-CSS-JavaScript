const statusEl = document.getElementById('status');
const feedbackEl = document.getElementById('feedback');
const connectBtn = document.getElementById('connectBtn');
const radarEl = document.getElementById('radar');
const cmdButtons = document.querySelectorAll('[data-cmd]');

// UUIDs padrão de módulos BLE seriais (ex.: HM-10 / HC-08)
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

const COMMAND_LABELS = {
  up: 'Cima',
  down: 'Baixo',
  left: 'Esquerda',
  right: 'Direita',
  ok: 'OK',
  play: 'Play',
  stop: 'Parar',
  volup: 'Vol +',
  voldown: 'Vol -',
};

let device = null;
let characteristic = null;
let feedbackTimeoutId = null;
let errorResetTimeoutId = null;

function setStatus(text, state) {
  statusEl.textContent = text;
  radarEl.classList.remove('is-connecting', 'is-connected', 'is-error');
  if (state) radarEl.classList.add(`is-${state}`);
}

function setControlsEnabled(enabled) {
  cmdButtons.forEach((btn) => {
    btn.disabled = !enabled;
  });
}

function showFeedback(text) {
  feedbackEl.textContent = text;
  clearTimeout(feedbackTimeoutId);
  feedbackTimeoutId = setTimeout(() => {
    feedbackEl.textContent = '\u00A0';
  }, 1200);
}

function onDisconnected() {
  characteristic = null;
  device = null;
  setStatus('Não conectado', 'idle');
  setControlsEnabled(false);
  connectBtn.disabled = false;
  connectBtn.classList.remove('is-linked');
  connectBtn.textContent = 'Conectar dispositivo';
}

async function connectToDevice() {
  if (!navigator.bluetooth) {
    setStatus('Este navegador não suporta Bluetooth. Use o Chrome ou o Edge.', 'error');
    return;
  }

  connectBtn.disabled = true;
  setStatus('Procurando dispositivo...', 'connecting');

  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });

    device.addEventListener('gattserverdisconnected', onDisconnected);

    setStatus('Conectando...', 'connecting');
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    setStatus(`Conectado: ${device.name || 'dispositivo'}`, 'connected');
    setControlsEnabled(true);
    connectBtn.classList.add('is-linked');
    connectBtn.textContent = 'Desconectar';
  } catch (err) {
    console.error(err);
    if (err.name === 'NotFoundError') {
      // Usuário cancelou a seleção do dispositivo
      setStatus('Não conectado', 'idle');
    } else {
      setStatus('Falha na conexão.', 'error');
      clearTimeout(errorResetTimeoutId);
      errorResetTimeoutId = setTimeout(() => {
        if (!device) setStatus('Não conectado', 'idle');
      }, 3000);
    }
  } finally {
    connectBtn.disabled = false;
  }
}

connectBtn.addEventListener('click', async () => {
  if (device && device.gatt && device.gatt.connected) {
    device.gatt.disconnect();
    return;
  }
  await connectToDevice();
});

cmdButtons.forEach((btn) => {
  btn.addEventListener('click', () => sendCommand(btn.dataset.cmd));
});

async function sendCommand(command) {
  if (!characteristic) return;
  try {
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(command));
    showFeedback(`Enviado: ${COMMAND_LABELS[command] || command}`);
  } catch (err) {
    console.error(err);
    showFeedback('Falha ao enviar comando.');
  }
}

setStatus('Não conectado', 'idle');
setControlsEnabled(false);