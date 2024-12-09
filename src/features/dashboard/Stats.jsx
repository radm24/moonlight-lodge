import {
  HiOutlineBriefcase,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";

export default function Stats({ bookings, stays, numDays, cabinsCount }) {
  // 1. Bookings count
  const bookingsCount = bookings.length;

  // 2. Sales
  const sales = bookings.reduce(
    (acc, { total_price, extras_price }) => acc + total_price + extras_price,
    0
  );

  // 3. Check ins
  const checkins = stays.length;

  // 4. Occupation
  // stayed nights / (all nights * num cabins)
  const stayedNights = stays.reduce(
    (acc, { num_nights }) => acc + num_nights,
    0
  );
  const occupation = stayedNights / (numDays * cabinsCount);

  return (
    <>
      <Stat
        title="Bookings"
        value={bookingsCount}
        icon={<HiOutlineBriefcase />}
        color="blue"
      />
      <Stat
        title="Sales"
        value={formatCurrency(sales)}
        icon={<HiOutlineBanknotes />}
        color="green"
      />
      <Stat
        title="Check ins"
        value={checkins}
        icon={<HiOutlineCalendarDays />}
        color="indigo"
      />
      <Stat
        title="Occupancy rate"
        value={`${Math.round(occupation * 100)}%`}
        icon={<HiOutlineChartBar />}
        color="yellow"
      />
    </>
  );
}
