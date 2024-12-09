import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

import Spinner from "../../ui/Spinner";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function UpdateSettingsForm() {
  const { isLoading, settings = {} } = useSettings();
  const { isPending, updateSetting } = useUpdateSetting();

  const {
    min_booking_length,
    max_booking_length,
    max_guests_per_booking,
    breakfast_price,
  } = settings;

  const handleBlur = (e, field) => {
    const value = Number(e.target.value);
    const targetId = e.target.id;

    if (
      value <= 0 ||
      (targetId === "min-nights" && value > settings["max_booking_length"]) ||
      (targetId === "max-nights" && value < settings["min_booking_length"])
    )
      return e.target.form.reset();

    if (!value || settings[field] === value) return;

    updateSetting({ [field]: value });
  };

  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          disabled={isPending}
          defaultValue={min_booking_length}
          onBlur={(e) => handleBlur(e, "min_booking_length")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          disabled={isPending}
          defaultValue={max_booking_length}
          onBlur={(e) => handleBlur(e, "max_booking_length")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          disabled={isPending}
          defaultValue={max_guests_per_booking}
          onBlur={(e) => handleBlur(e, "max_guests_per_booking")}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          disabled={isPending}
          defaultValue={breakfast_price}
          onBlur={(e) => handleBlur(e, "breakfast_price")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
