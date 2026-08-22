//document.addEventListener("DOMContentLoaded", () => {
//  const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE', 'TEXTAREA']);
//
//
//  const shortWord = '[А-Яа-яҐґЄєІіЇї]{1,2}';
//  const regex = new RegExp(`(\\s|\\u00A0)(${shortWord}) (?=${shortWord})`, 'g');
//
//  function walk(node) {
//    if (ignoredTags.has(node.nodeName)) return;
//
//    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
//      let text = node.nodeValue;
//
//      let replaced;
//      do {
//        replaced = false;
//        text = text.replace(regex, (_, space, word) => {
//          replaced = true;
//          return space + word + '\u00A0';
//        });
//      } while (replaced);
//
//
//      text = text.replace(/\s*—/g, '\u00A0—');
//      text = text.replace(/\s*→/g, '\u00A0→');
//        
//      node.nodeValue = text;
//    } else {
//      node.childNodes.forEach(walk);
//    }
//  }
//
//  walk(document.body);
//});
//




document.addEventListener("DOMContentLoaded", () => {
  // Теги, внутри которых не следует вносить изменения
  const ignoredTags = new Set([
    'SCRIPT',
    'STYLE',
    'NOSCRIPT',
    'IFRAME',
    'CODE',
    'PRE',
    'TEXTAREA',
  ]);

  // Регулярное выражение для поиска коротких слов (1-2 символа)
  const shortWord = '[А-Яа-яҐґЄєІіЇї]{1,2}';
  // Ищем: пробел или неразрывный пробел, затем короткое слово, затем обычный пробел
  // при условии, что за ним следует ещё короткое слово.
  const regexShort = new RegExp(`(\\s|\\u00A0)(${shortWord}) (?=${shortWord})`, 'g');

  // Объединённое регулярное выражение для символов, перед которыми нужно заменить пробелы (например, тире и стрелка)
  const regexBeforeSymbol = /\s*([—+→])/g;

  // Создаем TreeWalker для обхода всех текстовых узлов, исключая те, что находятся внутри игнорируемых тегов.
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return ignoredTags.has(node.parentNode.nodeName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) {
      let text = node.nodeValue;

      // Многократная замена коротких слов, чтобы учесть все случаи после предыдущих замен
      let replaced;
      do {
        replaced = false;
        text = text.replace(regexShort, (match, space, word) => {
          replaced = true;
          return space + word + '\u00A0';
        });
      } while (replaced);

      // Заменяем любые пробелы перед символами (тире и стрелкой) на неразрывный пробел
      text = text.replace(regexBeforeSymbol, '\u00A0$1');

      node.nodeValue = text;
    }
  }
//}); 
//document.addEventListener



//document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".animate");
  
  animatedElements.forEach((element, index) => {
    // Для каждого элемента добавляем задержку, зависящую от его позиции в списке
    setTimeout(() => {
      element.classList.add("visible");
    }, index * 500); // 500 мс между появлением каждого блока (можно настроить)
  });
}); 
//document.addEventListener



