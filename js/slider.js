document.addEventListener('DOMContentLoaded', function () {

    const slides = document.querySelectorAll('.slide');
    const dotsWrap = document.querySelector('.dots');

    if (!slides.length) return;

    let current = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => show(i));
        dotsWrap.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function show(index) {

        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    document.querySelector('.prev')
        .addEventListener('click', () => show(current - 1));

    document.querySelector('.next')
        .addEventListener('click', () => show(current + 1));

    document.querySelector('.click-left')
        .addEventListener('click', () => show(current - 1));

    document.querySelector('.click-right')
        .addEventListener('click', () => show(current + 1));

    show(0);

});