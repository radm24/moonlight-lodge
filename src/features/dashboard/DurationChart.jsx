import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import { useTheme } from "../../contexts/ThemeContext";

import Heading from "../../ui/Heading";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

const chartConfig = {
  light: [
    {
      duration: "1 night",
      color: "#ef4444",
    },
    {
      duration: "2 nights",
      color: "#f97316",
    },
    {
      duration: "3 nights",
      color: "#eab308",
    },
    {
      duration: "4-5 nights",
      color: "#84cc16",
    },
    {
      duration: "6-7 nights",
      color: "#22c55e",
    },
    {
      duration: "8-14 nights",
      color: "#14b8a6",
    },
    {
      duration: "15-21 nights",
      color: "#3b82f6",
    },
    {
      duration: "21+ nights",
      color: "#a855f7",
    },
  ],
  dark: [
    {
      duration: "1 night",
      color: "#b91c1c",
    },
    {
      duration: "2 nights",
      color: "#c2410c",
    },
    {
      duration: "3 nights",
      color: "#a16207",
    },
    {
      duration: "4-5 nights",
      color: "#4d7c0f",
    },
    {
      duration: "6-7 nights",
      color: "#15803d",
    },
    {
      duration: "8-14 nights",
      color: "#0f766e",
    },
    {
      duration: "15-21 nights",
      color: "#1d4ed8",
    },
    {
      duration: "21+ nights",
      color: "#7e22ce",
    },
  ],
};

function prepareData(stays, chartConfig) {
  const stayDurationMap = {
    "1 night": { value: 0, condition: (num) => num === 1 },
    "2 nights": { value: 0, condition: (num) => num === 2 },
    "3 nights": { value: 0, condition: (num) => num === 3 },
    "4-5 nights": { value: 0, condition: (num) => [4, 5].includes(num) },
    "6-7 nights": { value: 0, condition: (num) => [6, 7].includes(num) },
    "8-14 nights": { value: 0, condition: (num) => num >= 8 && num <= 14 },
    "15-21 nights": { value: 0, condition: (num) => num >= 15 && num <= 21 },
    "21+ nights": { value: 0, condition: (num) => num >= 21 },
  };

  stays.forEach(({ num_nights }) => {
    for (const value of Object.values(stayDurationMap)) {
      if (value.condition(num_nights)) {
        value.value++;
        return;
      }
    }
  });

  const data = chartConfig
    .map((option) => ({
      ...option,
      value: stayDurationMap[option.duration].value,
    }))
    .filter((entry) => entry.value > 0);

  return data;
}

function DurationChart({ stays }) {
  const { theme } = useTheme();
  const data = prepareData(stays, chartConfig[theme]);

  return (
    <ChartBox>
      <Heading as="h2">Stay duration summary</Heading>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="duration"
            cx="40%"
            cy="50%"
            innerRadius={85}
            outerRadius={110}
            paddingAngle={3}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            width="30%"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default DurationChart;
