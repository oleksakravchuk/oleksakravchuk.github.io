/**
 * Возвращает промис, который разрешается через указанное время.
 */
function timeoutPromise(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Функция для ожидания загрузки всех изображений внутри блока.
 * Если изображение не загрузится за maxTimeout мс, промис разрешится всё равно.
 */
function waitImages(element, maxTimeout = 1000) {
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
 * Функция ожидает, пока внутренняя DOM-структура блока стабилизируется.
 * Если за maxTimeout мс изменений не происходит, возвращает resolve.
 */
function waitForContentSettle(element, delay = 300, maxTimeout = 500) {
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
    
    // Фоллбэк, если изменений вообще не произойдет за maxTimeout
    timer = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, maxTimeout);
  });
}

/**
 * Обрабатывает блок: ждёт загрузку изображений и стабилизацию содержимого,
 * но с fallback-таймаутами, чтобы контент отображался не дольше заданного времени.
 */
function processBlock(el) {
  Promise.race([ waitImages(el), timeoutPromise(1000) ])
    .then(() => Promise.race([ waitForContentSettle(el), timeoutPromise(500) ]))
    .then(() => {
      el.classList.add("visible");
    });
}

/**
 * Функция для проверки, находится ли элемент в области видимости окна.
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
  
  // Приоритетная обработка для видимых элементов
  inViewElements.forEach(processBlock);
  
  // Остальные обрабатываем, когда браузер свободен
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      offscreenElements.forEach(processBlock);
    });
  } else {
    setTimeout(() => {
      offscreenElements.forEach(processBlock);
    }, 500);
  }
});
