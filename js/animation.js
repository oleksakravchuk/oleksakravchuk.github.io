document.addEventListener("DOMContentLoaded", () => {
  // Находим все элементы с классом "animate"
  const animatedElements = document.querySelectorAll(".animate");

  // Опции для IntersectionObserver: следим за появлением хотя бы X% элемента в зоне видимости
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.05
  };

  // Создаем наблюдатель
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Добавляем класс для запуска анимации
        entry.target.classList.add("visible");
        // Перестаем наблюдать за элементом, чтобы анимация сработала только один раз
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем каждый элемент
  animatedElements.forEach(el => observer.observe(el));
});


