import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function DesempenhoGraficos() {
  const dadosSemanal = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        label: "Serviços Concluídos",
        data: [2, 3, 1, 4, 2, 0, 1],
        backgroundColor: "#4caf50",
      },
    ],
  };

  const dadosMensal = {
    labels: ["Ago", "Set", "Out", "Nov", "Dez", "Jan"],
    datasets: [
      {
        label: "Serviços Concluídos",
        data: [12, 15, 10, 18, 20, 5],
        backgroundColor: "#2196f3",
      },
    ],
  };

  const opcoes = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="graficos-container">
      <div className="grafico-box">
        <h4>📅 Desempenho Semanal</h4>
        <Bar data={dadosSemanal} options={{ ...opcoes, title: { text: "Últimos 7 dias" } }} />
      </div>

      <div className="grafico-box">
        <h4>📈 Desempenho Mensal</h4>
        <Bar data={dadosMensal} options={{ ...opcoes, title: { text: "Últimos 6 meses" } }} />
      </div>
    </div>
  );
}
