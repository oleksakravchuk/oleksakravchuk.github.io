document.addEventListener("DOMContentLoaded", function() {
  // Настраиваем параметры наблюдателя: отслеживаем элемент, когда он становится виден на 10%
  const observerOptions = {
    root: null, // используем окно браузера как область наблюдения
    threshold: 0.1 // элемент должен стать видимым хотя бы на X%
  };

  // Функция-колбэк для наблюдателя
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Добавляем класс "visible", чтобы запустить анимацию
        entry.target.classList.add("visible");

        // После запуска анимации перестаем наблюдать за элементом, чтобы анимация не повторялась
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Находим все элементы с классом "animate" и начинаем за ними наблюдать
  document.querySelectorAll(".animate").forEach(elem => {
    observer.observe(elem);
  });
});
