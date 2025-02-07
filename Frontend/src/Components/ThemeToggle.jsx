import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../feature/ToggleMode/ToggleModeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <button
      onClick={() => dispatch(toggletheme())}
      className="p-2 bg-gray-800 text-white rounded-md"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
