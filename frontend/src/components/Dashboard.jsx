import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-card">
      <h2>Analytics Overview</h2>
      <div className="stats-grid">
        <div className="stat-box"><strong>Total:</strong> {total}</div>
        <div className="stat-box"><strong>Completed:</strong> {completed}</div>
        <div className="stat-box"><strong>Pending:</strong> {pending}</div>
        <div className="stat-box"><strong>Progress:</strong> {completionRate}%</div>
      </div>
      <div className="chart-container">
        <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}