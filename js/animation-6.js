// script.js
/**
 * Функция ожидания стабилизации контента внутри блока,
 * используя MutationObserver для отслеживания изменений.
 */
function waitForContentSettle(element, delay = 300) {
  return new Promise(resolve => {
    let timer;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, delay);
    });
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });
    // Если мутаций вообще нет, сработает по таймеру.
    timer = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, delay);
  });
}

/**
 * Функция ожидания загрузки всех изображений внутри блока.
 */
function waitImages(element) {
  const imgs = element.querySelectorAll("img");
  return Promise.all(
    Array.from(imgs).map(img =>
      new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        }
      })
    )
  );
}

/**
 * Основная функция обработки блока:
 * ждём загрузки изображений и стабилизации содержания, затем запускаем анимацию.
 */
function processBlock(el) {
  waitImages(el).then(() => {
    waitForContentSettle(el).then(() => {
      el.classList.add("visible");
    });
  });
}

/**
 * Проверка, находится ли элемент в зоне видимости.
 */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const allElements = document.querySelectorAll(".animate");
  const inViewElements = [];
  const offscreenElements = [];

  allElements.forEach(el => {
    if (isInViewport(el)) {
      inViewElements.push(el);
    } else {
      offscreenElements.push(el);
    }
  });

  // Обрабатываем элементы, находящиеся в зоне видимости, сразу
  inViewElements.forEach(processBlock);

  // Обрабатываем отложенные элементы, когда браузер свободен
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      offscreenElements.forEach(processBlock);
    });
  } else {
    // Альтернативно можно использовать setTimeout
    setTimeout(() => {
      offscreenElements.forEach(processBlock);
    }, 500);
  }
});
