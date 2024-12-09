import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { eachDayOfInterval, subDays, format, isSameDay } from "date-fns";
import styled from "styled-components";
import { useTheme } from "../../contexts/ThemeContext";

import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const colors = {
  light: {
    totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
    extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
    text: "#374151",
    background: "#fff",
  },
  dark: {
    totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
    extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
    text: "#e5e7eb",
    background: "#18212f",
  },
};

function SalesChart({ bookings, numDays }) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const daysInterval = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = daysInterval.map((date) => {
    const sameDateBookings = bookings.filter(({ created_at }) =>
      isSameDay(date, created_at)
    );

    return {
      label: format(date, "MMM dd"),
      totalSales: sameDateBookings.reduce(
        (acc, { total_price }) => acc + total_price,
        0
      ),
      extrasSales: sameDateBookings.reduce(
        (acc, { extras_price }) => acc + extras_price,
        0
      ),
    };
  });

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(daysInterval.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(daysInterval.at(-1), "MMM dd yyyy")}
      </Heading>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: themeColors.text }}
            tickLine={{ stroke: themeColors.text }}
          />
          <YAxis
            dataKey="totalSales"
            unit="$"
            tick={{ fill: themeColors.text }}
            tickLine={{ stroke: themeColors.text }}
          />
          <CartesianGrid strokeDasharray="4" fill={themeColors.background} />
          <Tooltip contentStyle={{ backgroundColor: themeColors.background }} />
          <Area
            type="monotone"
            dataKey="totalSales"
            name="Total sales"
            unit="$"
            strokeWidth="2"
            stroke={themeColors.totalSales.stroke}
            fill={themeColors.totalSales.fill}
          />
          <Area
            type="monotone"
            dataKey="extrasSales"
            name="Extras sales"
            unit="$"
            strokeWidth="2"
            stroke={themeColors.extrasSales.stroke}
            fill={themeColors.extrasSales.fill}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
