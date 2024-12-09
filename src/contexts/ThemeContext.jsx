import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    "theme"
  );

  const toggleTheme = () =>
    setTheme((theme) => (theme === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("ThemeContext is used outside of ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
