import { createContext } from "react";

// Shared React contexts — imported by both App.jsx and FullTeam.jsx
export const ThemeContext = createContext(null);
export const LangContext = createContext(null);
export const NavigationContext = createContext({ page: "home", navigate: () => {} });
