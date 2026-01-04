import React from "react";
import { Bar } from "react-chartjs-2";

export default function ChartDashboard({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Serviços",
        data: data.values,
        backgroundColor: "rgba(30, 136, 229, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
}
