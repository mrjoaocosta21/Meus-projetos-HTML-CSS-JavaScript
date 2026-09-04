const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');
const playBtn = document.getElementById('play');
const downloadLink = document.getElementById('download');
const statusEl = document.getElementById('status');
const timerEl = document.getElementById('timer');
const reelsEl = document.getElementById('reels');
const meterEl = document.getElementById('meter');

// Monta as barrinhas do medidor de volume (VU meter)
const BAR_COUNT = 20;
for (let i = 0; i < BAR_COUNT; i++) {
  const bar = document.createElement('div');
  bar.className = 'meter__bar';
  meterEl.appendChild(bar);
}
const bars = Array.from(meterEl.querySelectorAll('.meter__bar'));

let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioUrl = null;
let audioEl = null;
let stream = null;
let audioCtx = null;
let analyser = null;
let meterRafId = null;
let timerIntervalId = null;
let elapsedSeconds = 0;

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function startTimer() {
  elapsedSeconds = 0;
  timerEl.textContent = formatTime(0);
  timerIntervalId = setInterval(() => {
    elapsedSeconds += 1;
    timerEl.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
}

function pickMimeType() {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  if (!window.MediaRecorder) return '';
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

// Anima as barrinhas de acordo com o volume real do microfone
function startMeter() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  const source = audioCtx.createMediaStreamSource(stream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  function draw() {
    analyser.getByteFrequencyData(data);
    bars.forEach((bar, i) => {
      const value = data[i % data.length];
      const height = Math.max(4, Math.round((value / 255) * 32));
      bar.style.height = `${height}px`;
      bar.style.backgroundColor = value > 190 ? 'var(--accent-red)' : 'var(--accent-amber-dim)';
    });
    meterRafId = requestAnimationFrame(draw);
  }
  draw();
}

function stopMeter() {
  if (meterRafId) cancelAnimationFrame(meterRafId);
  meterRafId = null;
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  bars.forEach((bar) => {
    bar.style.height = '4px';
    bar.style.backgroundColor = 'var(--accent-amber-dim)';
  });
}

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    setStatus('Não foi possível acessar o microfone.');
    return;
  }

  audioChunks = [];
  const mimeType = pickMimeType();
  mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
    audioUrl = URL.createObjectURL(audioBlob);

    const type = mediaRecorder.mimeType || '';
    const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';

    downloadLink.href = audioUrl;
    downloadLink.download = `gravacao-${Date.now()}.${ext}`;
    downloadLink.classList.remove('is-disabled');
    downloadLink.removeAttribute('aria-disabled');

    playBtn.disabled = false;
    setStatus('Gravação parada. Pronta para reproduzir ou baixar.');

    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  };

  mediaRecorder.start();
  startTimer();
  startMeter();

  reelsEl.classList.add('is-recording');
  recordBtn.classList.add('is-active');
  recordBtn.disabled = true;
  stopBtn.disabled = false;
  playBtn.disabled = true;
  downloadLink.classList.add('is-disabled');
  downloadLink.setAttribute('aria-disabled', 'true');
  setStatus('Gravando...');
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
  mediaRecorder.stop();
  stopTimer();
  stopMeter();

  reelsEl.classList.remove('is-recording');
  recordBtn.classList.remove('is-active');
  recordBtn.disabled = false;
  stopBtn.disabled = true;
}

function playRecording() {
  if (!audioUrl) return;
  if (audioEl) {
    audioEl.pause();
    audioEl = null;
  }
  audioEl = new Audio(audioUrl);
  playBtn.disabled = true;
  setStatus('Reproduzindo...');

  audioEl.onended = () => {
    playBtn.disabled = false;
    setStatus('Reprodução concluída.');
  };
  audioEl.onerror = () => {
    playBtn.disabled = false;
    setStatus('Não foi possível reproduzir o áudio.');
  };

  audioEl.play();
}

recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
playBtn.addEventListener('click', playRecording);
downloadLink.addEventListener('click', (e) => {
  if (downloadLink.classList.contains('is-disabled')) e.preventDefault();
});

setStatus('Pronto para gravar');