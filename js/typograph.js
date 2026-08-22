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
}); 
//document.addEventListener



