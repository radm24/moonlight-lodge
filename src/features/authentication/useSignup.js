import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { signup as signupApi } from "../../services/apiAuth";

export function useSignup() {
  const { isPending, mutate: signup } = useMutation({
    mutationFn: signupApi,
    onSuccess: () =>
      toast.success(
        "Account successfully created! \nPlease verify the new account from user's email address."
      ),
    onError: (err) => {
      console.log("Error: ", err.message);
      toast.error(err.message);
    },
  });

  return { isPending, signup };
}
