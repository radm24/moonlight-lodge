import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { duplicateCabin as duplicateCabinApi } from "../../services/apiCabins";

export function useDuplicateCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDuplicating, mutate: duplicateCabin } = useMutation({
    mutationFn: duplicateCabinApi,
    onSuccess: () => {
      toast.success("Cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDuplicating, duplicateCabin };
}
