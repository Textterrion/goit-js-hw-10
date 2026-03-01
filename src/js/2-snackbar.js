'use strict';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const input = event.target.elements.delay.value;
  if (input <= 0 || input > 20000) {
    iziToast.error({
      title: 'Error',
      message: 'Delay must be between 0 and 20000 ms',
      position: 'topRight',
    });
    form.reset();
    return;
  }

  const delay = Number(event.target.elements.delay.value);
  const option = event.target.elements.state.value;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      option === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  })
    .then(delay => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      iziToast.success({
        title: 'Success',
        message: `Promise fulfilled in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      iziToast.error({
        title: 'Error',
        message: `Promise rejected in ${delay}ms`,
        position: 'topRight',
      });
    });
  form.reset();
});
