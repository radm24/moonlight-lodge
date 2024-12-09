import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import logoLight from "/logo-light.png";
import logoDark from "/logo-dark.png";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { theme } = useTheme();

  return (
    <StyledLogo>
      <Img src={theme === "light" ? logoLight : logoDark} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
