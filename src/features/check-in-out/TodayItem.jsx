import { Link } from "react-router-dom";
import styled from "styled-components";

import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

const statusToTagName = {
  unconfirmed: {
    color: "green",
    message: "Arriving",
  },
  "checked-in": { color: "blue", message: "Departing" },
};

function TodayItem({
  activity: { id: bookingId, status, guests, num_nights: numNights },
}) {
  return (
    <StyledTodayItem>
      <Tag type={statusToTagName[status].color}>
        {statusToTagName[status].message}
      </Tag>

      <Flag src={guests.country_flag} alt={`Flag of ${guests.nationality}`} />
      <Guest>{guests.full_name}</Guest>
      <div>{numNights} nights</div>

      {status === "unconfirmed" && (
        <Button $size="small" as={Link} to={`/checkin/${bookingId}`}>
          Check in
        </Button>
      )}
      {status === "checked-in" && <CheckoutButton bookingId={bookingId} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
