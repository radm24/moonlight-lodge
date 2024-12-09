import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createUpdateCabin as createUpdateCabinApi } from "../../services/apiCabins";

export function useCreateUpdateCabin(cabinToEdit = {}) {
  const isEditMode = Boolean(cabinToEdit.id);

  const queryClient = useQueryClient();

  const { isPending, mutate: createUpdateCabin } = useMutation({
    mutationFn: (data) =>
      createUpdateCabinApi({
        ...data,
        image:
          typeof data.image === "object" && data.image[0] // check if an image is selected
            ? data.image[0] // image is selected
            : cabinToEdit.image, // image is not selected (only in edit mode)
      }),
    onSuccess: () => {
      toast.success(`Cabin successfully ${isEditMode ? "updated" : "added"}`);
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isPending, createUpdateCabin };
}
