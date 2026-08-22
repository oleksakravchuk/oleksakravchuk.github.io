document.addEventListener("DOMContentLoaded", () => {
  const delayBeforeShowing = 100; // Задержка перед запуском анимации (ms)
  const blocks = document.querySelectorAll('.animate');

  blocks.forEach(block => {
    // Собираем асинхронные элементы внутри блока: img, video, iframe
    const asyncElements = block.querySelectorAll('img, video, iframe');
    let promises = [];

    asyncElements.forEach(el => {
      // Для изображений проверяем: если они не загружены или данные невалидны (например, naturalWidth равен 0)
      if (el.tagName === 'IMG') {
        if (!el.complete || el.naturalWidth === 0) {
          promises.push(new Promise(resolve => {
            el.addEventListener('load', resolve);
            el.addEventListener('error', resolve);
          }));
        }
      } else {
        // Для video, iframe — ждём события 'load'
        promises.push(new Promise(resolve => {
          el.addEventListener('load', resolve);
          el.addEventListener('error', resolve);
        }));
      }
    });

    // Функция для запуска анимации (с принудительным рефлоу)
    const showBlock = () => {
      // Принудительный reflow, чтобы браузер применил стили до анимации
      void block.offsetWidth;
      block.classList.add('visible');
    };

    // Если внутри есть асинхронные элементы — ждём их загрузки
    if (promises.length > 0) {
      Promise.all(promises).then(() => {
        setTimeout(showBlock, delayBeforeShowing);
      });
    } else {
      // Если асинхронных элементов нет, всё равно делаем задержку, чтобы обеспечить единообразие
      setTimeout(showBlock, delayBeforeShowing);
    }
  });
});
