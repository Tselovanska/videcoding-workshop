// Посилання на елементи DOM
const participantsInput = document.getElementById('participants');
const rateInput = document.getElementById('rate');
const toggleBtn = document.getElementById('toggle');
const burnedDisplay = document.getElementById('burned');
const elapsedDisplay = document.getElementById('elapsed');
const timerRow = document.getElementById('timerRow');

// Стан таймера
let intervalId = null;        // ідентифікатор setInterval
let running = false;          // чи працює таймер зараз
let accumulatedMs = 0;        // накопичений час з попередніх запусків (мс)
let startTimestamp = 0;       // момент старту поточного відрізку (мс)

// Повертає загальний елапсед у мілісекундах (накопичений + поточний відрізок)
function getElapsedMs() {
    if (running) {
        return accumulatedMs + (Date.now() - startTimestamp);
    }
    return accumulatedMs;
}

// Форматує секунди у вигляді HH:MM:SS
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Оновлює обидва дисплеї на основі поточного стану
function updateDisplays() {
    const elapsedMs = getElapsedMs();
    const elapsedSeconds = elapsedMs / 1000;

    const participants = Number(participantsInput.value) || 0;
    const rate = Number(rateInput.value) || 0;

    // Формула: спалено = учасники * ставка * (секунди / 3600)
    const burned = participants * rate * (elapsedSeconds / 3600);

    burnedDisplay.textContent = burned.toFixed(2);
    elapsedDisplay.textContent = formatTime(elapsedSeconds);
}

// Запуск (або продовження) таймера
function start() {
    running = true;
    startTimestamp = Date.now();

    // Блокуємо поля вводу, поки таймер працює
    participantsInput.disabled = true;
    rateInput.disabled = true;

    // Оновлення кнопки
    toggleBtn.textContent = 'Стоп';
    toggleBtn.classList.remove('btn-start');
    toggleBtn.classList.add('btn-stop');

    // Вмикаємо пульсацію точки біля таймера
    timerRow.classList.add('is-running');

    // Оновлення дисплею кожні 100 мс
    intervalId = setInterval(updateDisplays, 100);
    updateDisplays();
}

// Пауза таймера — зберігаємо накопичений час, значення на екрані не скидаємо
function stop() {
    accumulatedMs += Date.now() - startTimestamp;
    running = false;

    clearInterval(intervalId);
    intervalId = null;

    // Розблоковуємо поля вводу
    participantsInput.disabled = false;
    rateInput.disabled = false;

    // Повертаємо кнопку у стан "Старт"
    toggleBtn.textContent = 'Старт';
    toggleBtn.classList.remove('btn-stop');
    toggleBtn.classList.add('btn-start');

    // Вимикаємо пульсацію точки
    timerRow.classList.remove('is-running');

    // Фіксуємо останнє значення на екрані
    updateDisplays();
}

// Обробник кліку по кнопці — перемикає старт/стоп
toggleBtn.addEventListener('click', () => {
    if (running) {
        stop();
    } else {
        start();
    }
});
