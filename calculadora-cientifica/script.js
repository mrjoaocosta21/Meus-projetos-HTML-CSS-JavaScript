// ===== Elementos =====
const display = document.getElementById('display');
const secondBtn = document.getElementById('secondBtn');
const angleModeBtn = document.getElementById('angleModeBtn');
const secondTag = document.getElementById('secondTag');
const memoryTag = document.getElementById('memoryTag');
const angleTag = document.getElementById('angleTag');

// ===== Estado =====
let memory = 0;
let lastAnswer = 0;
let angleMode = 'deg'; // 'deg' | 'rad'
let secondMode = false;

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', '√']);
const PRECEDENCE = { 'u-': 3, '^': 4, '×': 2, '÷': 2, '+': 1, '-': 1 };
const RIGHT_ASSOC = new Set(['^', 'u-']);
const TOKEN_REGEX = /(asin|acos|atan|sin|cos|tan|log|ln|√|π|\d+\.?\d*|\.\d+|[+\-×÷^!%()e])/g;
const NUMBER_REGEX = /^(\d+\.?\d*|\.\d+)$/;

// ===== Entrada =====
function appendValue(value) {
  if (value === '.') {
    const currentNumber = display.value.match(/[0-9.]*$/)[0];
    if (currentNumber.includes('.')) return;
  }
  display.value += value;
  adjustDisplayFontSize();
}

function endsWithOperand(str) {
  return /[0-9)%!πe]$/.test(str);
}

// Insere parênteses, constantes e funções, adicionando multiplicação implícita
// quando faz sentido (ex.: "2" + "π" vira "2×π", "3" + "sin(" vira "3×sin(")
function appendSmart(token) {
  if (endsWithOperand(display.value)) {
    display.value += '×';
  }
  display.value += token;
  adjustDisplayFontSize();
}

function adjustDisplayFontSize() {
  display.classList.toggle('is-long', display.value.length > 16);
}

function clearDisplay() {
  display.value = '';
  adjustDisplayFontSize();
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
  adjustDisplayFontSize();
}

function handleFunctionKey(base) {
  const map = {
    sin: secondMode ? 'asin(' : 'sin(',
    cos: secondMode ? 'acos(' : 'cos(',
    tan: secondMode ? 'atan(' : 'tan(',
    log: secondMode ? '10^(' : 'log(',
    ln: secondMode ? 'e^(' : 'ln(',
  };
  appendSmart(map[base]);
}

// ===== Modos =====
function toggleSecondMode() {
  secondMode = !secondMode;
  secondBtn.classList.toggle('is-active', secondMode);
  secondTag.classList.toggle('is-active', secondMode);
  document.getElementById('sinBtn').textContent = secondMode ? 'sin⁻¹' : 'sin';
  document.getElementById('cosBtn').textContent = secondMode ? 'cos⁻¹' : 'cos';
  document.getElementById('tanBtn').textContent = secondMode ? 'tan⁻¹' : 'tan';
  document.getElementById('logBtn').textContent = secondMode ? '10ˣ' : 'log';
  document.getElementById('lnBtn').textContent = secondMode ? 'eˣ' : 'ln';
}

function toggleAngleMode() {
  angleMode = angleMode === 'deg' ? 'rad' : 'deg';
  const label = angleMode.toUpperCase();
  angleModeBtn.textContent = label;
  angleModeBtn.classList.toggle('is-active', angleMode === 'rad');
  angleTag.textContent = label;
}

// ===== Memória =====
function getCurrentValue() {
  try {
    return evaluateExpression(display.value);
  } catch (err) {
    return null;
  }
}

function memoryAdd() {
  const value = getCurrentValue();
  if (value === null) return;
  memory += value;
  updateMemoryTag();
}

function memorySubtract() {
  const value = getCurrentValue();
  if (value === null) return;
  memory -= value;
  updateMemoryTag();
}

function memoryRecall() {
  appendSmart(formatResult(memory));
}

function memoryClear() {
  memory = 0;
  updateMemoryTag();
}

function updateMemoryTag() {
  memoryTag.classList.toggle('is-active', memory !== 0);
}

function insertAns() {
  appendSmart(formatResult(lastAnswer));
}

// ===== Tokenização, conversão para RPN (shunting-yard) e avaliação =====
function tokenize(expr) {
  return expr.match(TOKEN_REGEX) || [];
}

function autoCloseParens(tokens) {
  const open = tokens.filter((t) => t === '(').length;
  const close = tokens.filter((t) => t === ')').length;
  const missing = open - close;
  return missing > 0 ? [...tokens, ...Array(missing).fill(')')] : tokens;
}

function toRPN(tokens) {
  const output = [];
  const opStack = [];
  let expectOperand = true;

  for (const token of tokens) {
    if (NUMBER_REGEX.test(token) || token === 'π' || token === 'e') {
      output.push(token);
      expectOperand = false;
    } else if (FUNCTIONS.has(token)) {
      opStack.push(token);
      expectOperand = true;
    } else if (token === '(') {
      opStack.push(token);
      expectOperand = true;
    } else if (token === ')') {
      while (opStack.length && opStack[opStack.length - 1] !== '(') {
        output.push(opStack.pop());
      }
      opStack.pop();
      if (opStack.length && FUNCTIONS.has(opStack[opStack.length - 1])) {
        output.push(opStack.pop());
      }
      expectOperand = false;
    } else if (token === '!' || token === '%') {
      output.push(token);
      expectOperand = false;
    } else if (token === '-' && expectOperand) {
      opStack.push('u-');
      expectOperand = true;
    } else if (token === '+' && expectOperand) {
      // unário positivo: ignorado
    } else {
      while (
        opStack.length &&
        opStack[opStack.length - 1] !== '(' &&
        PRECEDENCE[opStack[opStack.length - 1]] !== undefined &&
        (PRECEDENCE[opStack[opStack.length - 1]] > PRECEDENCE[token] ||
          (PRECEDENCE[opStack[opStack.length - 1]] === PRECEDENCE[token] && !RIGHT_ASSOC.has(token)))
      ) {
        output.push(opStack.pop());
      }
      opStack.push(token);
      expectOperand = true;
    }
  }

  while (opStack.length) output.push(opStack.pop());
  return output;
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Fatorial inválido');
  if (n > 170) throw new Error('Número muito grande');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function applyFunction(name, x) {
  const toRad = (v) => (angleMode === 'deg' ? (v * Math.PI) / 180 : v);
  const toDeg = (v) => (angleMode === 'deg' ? (v * 180) / Math.PI : v);

  switch (name) {
    case 'sin': return Math.sin(toRad(x));
    case 'cos': return Math.cos(toRad(x));
    case 'tan': return Math.tan(toRad(x));
    case 'asin': return toDeg(Math.asin(x));
    case 'acos': return toDeg(Math.acos(x));
    case 'atan': return toDeg(Math.atan(x));
    case 'log': return Math.log10(x);
    case 'ln': return Math.log(x);
    case '√': return Math.sqrt(x);
    default: throw new Error('Função desconhecida: ' + name);
  }
}

function applyBinary(op, a, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) throw new Error('Divisão por zero');
      return a / b;
    case '^': return Math.pow(a, b);
    default: throw new Error('Operador desconhecido: ' + op);
  }
}

function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (NUMBER_REGEX.test(token)) {
      stack.push(parseFloat(token));
    } else if (token === 'π') {
      stack.push(Math.PI);
    } else if (token === 'e') {
      stack.push(Math.E);
    } else if (token === '!') {
      stack.push(factorial(stack.pop()));
    } else if (token === '%') {
      stack.push(stack.pop() / 100);
    } else if (token === 'u-') {
      stack.push(-stack.pop());
    } else if (FUNCTIONS.has(token)) {
      stack.push(applyFunction(token, stack.pop()));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(applyBinary(token, a, b));
    }
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error('Expressão inválida');
  }
  return stack[0];
}

function evaluateExpression(expr) {
  if (!expr || !expr.trim()) throw new Error('Expressão vazia');
  const tokens = autoCloseParens(tokenize(expr));
  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}

function formatResult(value) {
  if (Math.abs(value) !== 0 && (Math.abs(value) >= 1e12 || Math.abs(value) < 1e-9)) {
    return value.toExponential(6).replace('e', 'E');
  }
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

function calculate() {
  if (!display.value.trim()) return;

  try {
    const result = evaluateExpression(display.value);
    lastAnswer = result;
    display.value = formatResult(result);
  } catch (err) {
    display.value = 'Erro';
  }
  adjustDisplayFontSize();
}

// ===== Teclado =====
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendValue(key);
  } else if (key === '.') {
    appendValue('.');
  } else if (key === '+') {
    appendValue('+');
  } else if (key === '-') {
    appendValue('-');
  } else if (key === '*') {
    appendValue('×');
  } else if (key === '/') {
    event.preventDefault();
    appendValue('÷');
  } else if (key === '(') {
    appendSmart('(');
  } else if (key === ')') {
    appendValue(')');
  } else if (key === '^') {
    appendValue('^');
  } else if (key === '%') {
    appendValue('%');
  } else if (key === '!') {
    appendValue('!');
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});

// ===== Estado inicial =====
updateMemoryTag();