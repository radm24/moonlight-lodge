import { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [openedId, setOpenedId] = useState("");
  const [position, setPosition] = useState(null);

  const open = (id, position) => {
    setOpenedId(id);
    setPosition(position);
  };
  const close = () => {
    setPosition(null);
    setOpenedId("");
  };

  return (
    <MenusContext.Provider
      value={{ openedId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { openedId, open, close } = useContext(MenusContext);

  const handleClick = (e) => {
    e.stopPropagation();
    if (id === openedId) return close();

    const rect = e.target.closest("button").getBoundingClientRect();
    const position = { x: window.innerWidth - rect.right, y: rect.bottom + 8 };
    open(id, position);
  };

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openedId, close, position } = useContext(MenusContext);

  const ref = useOutsideClick(close, false);

  useEffect(() => {
    if (openedId !== id) return;

    const scrollHandler = () => close();

    document.addEventListener("scroll", scrollHandler, {
      capture: true,
      once: true,
    });

    return () =>
      document.removeEventListener("scroll", scrollHandler, {
        capture: true,
        once: true,
      });
  }, [close, openedId, id]);

  if (openedId !== id) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, disabled, onClick }) {
  const { close } = useContext(MenusContext);

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <li>
      <StyledButton disabled={disabled} onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
