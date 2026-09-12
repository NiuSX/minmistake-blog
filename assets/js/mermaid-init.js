(function () {
  "use strict";

  var mermaidScriptUrl = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
  var mermaidBlocks = [];

  function collectMermaidBlocks() {
    var selectors = [
      ".page__content pre.mermaid",
      ".page__content div.mermaid",
      ".page__content code.language-mermaid",
      ".page__content div.language-mermaid.highlighter-rouge"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(function (element) {
      var sourceElement = element;
      var container = element;

      if (element.matches("code.language-mermaid")) {
        container = element.closest("div.language-mermaid.highlighter-rouge") || element.parentElement;
      }

      if (element.matches("div.language-mermaid.highlighter-rouge")) {
        sourceElement = element.querySelector("td.rouge-code, td.code, code") || element;
      }

      if (!container || container.dataset.mermaidProcessed === "true") {
        return;
      }

      var diagram = document.createElement("div");
      diagram.className = "mermaid";
      diagram.textContent = sourceElement.innerText.trim();

      container.dataset.mermaidProcessed = "true";
      container.replaceWith(diagram);
      mermaidBlocks.push(diagram);
    });
  }

  function renderMermaid() {
    if (!mermaidBlocks.length) {
      return;
    }

    if (!window.mermaid) {
      loadMermaid(renderMermaid);
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: document.documentElement.classList.contains("dark") ? "dark" : "default"
    });

    if (typeof window.mermaid.run === "function") {
      window.mermaid.run({ nodes: mermaidBlocks }).catch(function (error) {
        console.error("Failed to render Mermaid diagrams.", error);
      });
    } else if (typeof window.mermaid.init === "function") {
      window.mermaid.init(undefined, mermaidBlocks);
    }
  }

  function loadMermaid(callback) {
    var existingScript = document.querySelector('script[src="' + mermaidScriptUrl + '"]');

    if (existingScript) {
      existingScript.addEventListener("load", callback, { once: true });
      return;
    }

    var script = document.createElement("script");
    script.src = mermaidScriptUrl;
    script.onload = callback;
    document.head.appendChild(script);
  }

  collectMermaidBlocks();
  renderMermaid();
})();
