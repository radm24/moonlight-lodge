import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";

import { useUser } from "../features/authentication/useUser";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import LoginForm from "../features/authentication/LoginForm";
import Spinner from "../ui/Spinner";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/dashboard");
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <LoginLayout>
      {isLoading && <Spinner />}

      {!isLoading && !isAuthenticated && (
        <>
          <Logo />
          <Heading as="h4">Log in to your account</Heading>
          <LoginForm />
        </>
      )}
    </LoginLayout>
  );
}

export default Login;
