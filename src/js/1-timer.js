'use strict';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

const startButton = document.querySelector('button[data-start]');
startButton.disabled = true;
const input = document.querySelector('#datetime-picker');

let userSelectedDate = null;

flatpickr(input, {
  ...options,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    if (userSelectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
      input.disabled = false;
    } else {
      startButton.disabled = false;
    }
  },
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  document.querySelector('.value[data-days]').textContent =
    addLeadingZero(days);
  document.querySelector('.value[data-hours]').textContent =
    addLeadingZero(hours);
  document.querySelector('.value[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('.value[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function startTimer() {
  input.disabled = true;

  const timerInterval = setInterval(() => {
    const currentDate = new Date();
    const timeLeft = userSelectedDate - currentDate;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      updateTimerInterface(convertMs(0));
      iziToast.success({
        title: 'Success',
        message: 'Time is up!',
        position: 'topRight',
      });
      startButton.disabled = true;
      input.disabled = false;
      return;
    }
    const timeComponents = convertMs(timeLeft);
    updateTimerInterface(timeComponents);
  }, 1000);
  startButton.disabled = true;
}

startButton.addEventListener('click', startTimer);
