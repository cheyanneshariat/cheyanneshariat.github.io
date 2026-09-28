// Light/dark toggle. Dark is the default; choosing light is remembered in
// localStorage, and switching back to dark clears the saved choice.
(function () {
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (button) {
    button.addEventListener("click", function () {
      var toLight = root.dataset.theme !== "light";
      try {
        if (toLight) { root.dataset.theme = "light"; localStorage.setItem("theme", "light"); }
        else { delete root.dataset.theme; localStorage.removeItem("theme"); }
      } catch (e) {
        if (toLight) root.dataset.theme = "light"; else delete root.dataset.theme;
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
