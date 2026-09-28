// Light/dark toggle. With no saved choice the site follows the system
// setting. Clicking switches to the opposite of what is shown; if that matches
// the system setting, the saved choice is cleared so the site follows the
// system again.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.dataset.theme || (media.matches ? "dark" : "light");
  }

  var button = document.querySelector(".theme-toggle");
  if (button) {
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      var system = media.matches ? "dark" : "light";
      try {
        if (next === system) {
          delete root.dataset.theme;
          localStorage.removeItem("theme");
        } else {
          root.dataset.theme = next;
          localStorage.setItem("theme", next);
        }
      } catch (e) {
        root.dataset.theme = next;
      }
    });
  }

  // Publications: "All" / "First author" filter.
  var filter = document.querySelector("[data-pub-filter]");
  if (filter) {
    var target = document.querySelector(filter.getAttribute("data-pub-filter"));
    filter.addEventListener("click", function (event) {
      var b = event.target.closest("button");
      if (!b) return;
      filter.querySelectorAll("button").forEach(function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      target.classList.toggle("only-first", b.dataset.value === "first");
    });
  }

  // Copy-email button: copies the address and shows a checkmark briefly.
  document.querySelectorAll(".copy-email").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () {
        b.classList.add("copied");
        b.querySelector(".sr-only").textContent = "Email address copied";
        setTimeout(function () { b.classList.remove("copied"); b.querySelector(".sr-only").textContent = ""; }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t);
        t.select(); try { document.execCommand("copy"); done(); } catch (e) {} document.body.removeChild(t);
      }
    });
  });
})();
