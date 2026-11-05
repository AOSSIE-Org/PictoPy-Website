/** localStorage key and default theme shared by the head script and `ThemeProvider`. */
export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "system";

/**
 * Applies the saved theme to `<html>` from `<head>`, before `<body>` exists.
 *
 * `ThemeProvider` only sets the theme after React hydrates, so without this
 * the page first paints in the light colours and flashes on every load in
 * dark mode. Running it in `<head>` means the first paint already has the
 * right theme. `ThemeProvider` resolves the same saved value on mount and
 * takes over from there.
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||${JSON.stringify(
  DEFAULT_THEME,
)};if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.toggle("dark",t==="dark");d.style.colorScheme=t}catch(e){}})()`;
