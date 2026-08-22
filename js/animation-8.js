// Функция для создания fallback-промиса через ms миллисекунд.
function timeoutPromise(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Функция ожидает загрузки всех изображений внутри элемента.
 * Даже если какое-то изображение задерживается, через maxTimeout мс промис разрешится.
 */
function waitImages(element, maxTimeout = 300) {
  const imgs = element.querySelectorAll("img");
  const promises = Array.from(imgs).map(img => {
    return new Promise(resolve => {
      const timer = setTimeout(resolve, maxTimeout);
      if (img.complete) {
        clearTimeout(timer);
        resolve();
      } else {
        img.addEventListener("load", () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
        img.addEventListener("error", () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
      }
    });
  });
  return Promise.all(promises);
}

/**
 * Обрабатывает отдельный блок: ждём загрузки изображений,
 * но через fallback-таймаут (maxTimeout) показываем контент.
 */
function processBlock(el) {
  // Если JS включён, сразу добавляем класс animate-hidden,
  // чтобы запустить анимацию только если блок еще не готов.
  el.classList.add("animate-hidden");

  // Ждем загрузки изображений внутри блока с fallback 100 мс.
  Promise.race([ waitImages(el), timeoutPromise(300) ])
    .then(() => {
      // После ожидания, независимо от результата, показываем блок.
      // Снимаем animate-hidden и добавляем animate-visible для анимации.
      el.classList.remove("animate-hidden");
      el.classList.add("animate-visible");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Обрабатываем все элементы с классом "animate"
  const blocks = document.querySelectorAll(".animate");
  blocks.forEach(el => processBlock(el));
});
