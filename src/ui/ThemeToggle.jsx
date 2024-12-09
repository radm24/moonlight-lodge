import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useTheme } from "../contexts/ThemeContext";
import ButtonIcon from "./ButtonIcon";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ButtonIcon onClick={toggleTheme}>
      {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
    </ButtonIcon>
  );
}

export default ThemeToggle;
