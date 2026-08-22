document.addEventListener("DOMContentLoaded", () => {
  // Находим все элементы с классом "animate"
  const animatedElements = document.querySelectorAll(".animate");
  // Минимальная задержка в миллисекундах
  const minDelay = 300;

  // Функция, которая ждёт загрузки всех изображений внутри элемента
  function waitForImages(el) {
    // Берем список всех вложенных <img>
    const images = Array.from(el.querySelectorAll("img"));
    return Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }));
  }

  // Функция, возвращающая промис, который разрешается через указанное время
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Для каждого элемента ждём загрузки изображений и минимальной задержки
  animatedElements.forEach(el => {
    Promise.all([
      waitForImages(el),
      delay(minDelay)
    ]).then(() => {
      el.classList.add("visible");
      console.log("Блок показан после ожидания (минимум " + minDelay + " мс)");
    });
  });
});
