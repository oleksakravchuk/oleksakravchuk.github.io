/**
 * Функция, которая возвращает промис,
 * разрешающийся, когда внутри блока не происходит изменений в течение delay мс.
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

    // Если мутаций вообще нет, промис выполнится через delay.
    timer = setTimeout(() => {
      observer.disconnect();
      resolve();
    }, delay);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".animate");

  animatedElements.forEach(el => {
    // Получаем все изображения внутри блока
    const imgs = el.querySelectorAll("img");

    // Функция для ожидания загрузки изображений (если они есть)
    const waitImages = Promise.all(
      Array.from(imgs).map(img => {
        return new Promise(resolve => {
          if (img.complete) {
            resolve();
          } else {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }
        });
      })
    );

    // После загрузки изображений дополнительно ждём, пока не перестанут происходить мутации внутри блока
    waitImages.then(() => {
      waitForContentSettle(el).then(() => {
        el.classList.add("visible");
      });
    });
  });
});
