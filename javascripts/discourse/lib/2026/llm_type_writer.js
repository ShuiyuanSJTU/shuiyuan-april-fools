async function type(element, options = {}) {
  const baseSpeed = options.speed || 25;
  const clone = element.cloneNode(true);
  element.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "llm-cursor";
  if (options.cursorColor) {
    cursor.style.backgroundColor = options.cursorColor;
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function processNode(node, parentElement) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (text.trim() === "") {
        parentElement.appendChild(document.createTextNode(text));
        return;
      }

      const textNode = document.createTextNode("");
      parentElement.appendChild(textNode);
      parentElement.appendChild(cursor);

      // Simulate token-like chunked streaming output.
      let i = 0;
      while (i < text.length) {
        const charsToOutput = Math.floor(Math.random() * 6) + 1;

        const chunk = text.substring(i, i + charsToOutput);
        textNode.nodeValue += chunk;
        i += chunk.length;

        let randomDelay = baseSpeed + (Math.random() * 100 - 20);
        if (Math.random() < 0.05) {
          randomDelay += 200 + Math.random() * 300;
        }

        await delay(Math.max(10, randomDelay));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const newElement = node.cloneNode(false);
      parentElement.appendChild(newElement);
      const childNodes = Array.from(node.childNodes);
      for (const child of childNodes) {
        await processNode(child, newElement);
      }
    }
  }

  const rootChildren = Array.from(clone.childNodes);
  for (const child of rootChildren) {
    await processNode(child, element);
  }

  await delay(500);
  cursor.remove();
}

function observe(element, options = {}) {
  if (element.classList.contains("post__contents-cooked-quote")) {
    return;
  }
  const originalVisibility = element.style.visibility;
  element.style.visibility = "hidden";

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.style.visibility = originalVisibility || "visible";
          type(element, options);
          observer.unobserve(element);
        }
      });
    },
    {
      // Start typing when at least 10% of the element enters viewport.
      threshold: options.threshold || 0.1,
    }
  );

  observer.observe(element);
}

export default {
  type,
  observe,
};
