// Wait till the browser is ready to render the game (avoids glitches)

/**
 * Theme handling
 * - Applies a theme class on <html> (theme-light / theme-dark)
 * - Persists preference in localStorage
 * - Updates the toggle button label and aria-pressed state
 */
function ThemeManager(storage) {
  this.storage = storage || window.localStorage;
  this.key = "themePreference";
  this.defaultTheme = "light";
}

ThemeManager.prototype.isStorageAvailable = function () {
  try {
    if (!this.storage) return false;
    var testKey = "__theme_test__";
    this.storage.setItem(testKey, "1");
    this.storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

ThemeManager.prototype.getStoredTheme = function () {
  if (!this.isStorageAvailable()) return null;
  return this.storage.getItem(this.key);
};

ThemeManager.prototype.setStoredTheme = function (theme) {
  if (!this.isStorageAvailable()) return;
  this.storage.setItem(this.key, theme);
};

ThemeManager.prototype.getInitialTheme = function () {
  var stored = this.getStoredTheme();
  if (stored === "light" || stored === "dark") return stored;
  return this.defaultTheme;
};

ThemeManager.prototype.applyTheme = function (theme) {
  var root = document.documentElement;

  // Ensure only one theme class is present at a time
  root.classList.remove("theme-light");
  root.classList.remove("theme-dark");
  root.classList.add("theme-" + theme);
};

ThemeManager.prototype.updateToggleUI = function (theme) {
  var button = document.querySelector(".theme-toggle-button");
  if (!button) return;

  var isDark = theme === "dark";
  button.setAttribute("aria-pressed", isDark ? "true" : "false");
  button.textContent = isDark ? "Theme: Dark" : "Theme: Light";
  button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
};

ThemeManager.prototype.toggleTheme = function () {
  var current = document.documentElement.classList.contains("theme-dark") ? "dark" : "light";
  return current === "dark" ? "light" : "dark";
};

ThemeManager.prototype.init = function () {
  var initial = this.getInitialTheme();
  this.applyTheme(initial);
  this.updateToggleUI(initial);

  var self = this;
  var button = document.querySelector(".theme-toggle-button");
  if (button) {
    button.addEventListener("click", function () {
      var next = self.toggleTheme();
      self.applyTheme(next);
      self.setStoredTheme(next);
      self.updateToggleUI(next);
    });
  }
};

window.requestAnimationFrame(function () {
  // Use the game storage manager's storage when possible for consistent fallback behavior.
  var gameStorage = new LocalStorageManager();
  var themeStorage = gameStorage.storage || window.localStorage;

  var themeManager = new ThemeManager(themeStorage);
  themeManager.init();

  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
