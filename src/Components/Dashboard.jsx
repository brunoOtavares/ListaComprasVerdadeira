import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ purchaseHistory }) {
  if (!purchaseHistory || purchaseHistory.length === 0) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard de Compras</h2>
        <div className="empty-dashboard-message">
          <p>Ainda não há dados para exibir.</p>
          <p>Finalize uma compra na página "Fazendo Compras" para ver as estatísticas aqui.</p>
        </div>
      </div>
    );
  }

  // 1. Gasto Total
  const totalSpent = purchaseHistory.reduce((acc, purchase) => acc + purchase.total, 0);

  // 2. Itens mais comprados (por quantidade)
  const itemFrequency = purchaseHistory
    .flatMap(p => p.items)
    .reduce((acc, item) => {
      acc[item.text] = (acc[item.text] || 0) + item.quantity;
      return acc;
    }, {});
  
  const sortedItems = Object.entries(itemFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 3. Itens menos comprados (por quantidade)
  const leastBoughtItems = Object.entries(itemFrequency)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5);

  // 4. Itens mais caros (por preço unitário)
  const itemPrices = purchaseHistory
    .flatMap(p => p.items)
    .reduce((acc, item) => {
      if (!acc[item.text] || acc[item.text] < item.price) {
        acc[item.text] = item.price;
      }
      return acc;
    }, {});
  
  const mostExpensiveItems = Object.entries(itemPrices)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 5. Itens mais baratos (por preço unitário)
  const leastExpensiveItems = Object.entries(itemPrices)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 5);

  // 3. Dados para o gráfico de gastos ao longo do tempo
  const spendingOverTimeData = {
    labels: purchaseHistory.map(p => new Date(p.date).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Gasto por Compra (R$)',
        data: purchaseHistory.map(p => p.total),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
      },
    ],
  };

  // 6. Dados para o gráfico de itens mais comprados
  const topItemsData = {
    labels: sortedItems.map(([name]) => name),
    datasets: [
      {
        label: 'Quantidade Comprada',
        data: sortedItems.map(([, quantity]) => quantity),
        backgroundColor: '#2ecc71',
      },
    ],
  };

  // 7. Dados para o gráfico de itens menos comprados
  const leastBoughtData = {
    labels: leastBoughtItems.map(([name]) => name),
    datasets: [
      {
        label: 'Quantidade Comprada',
        data: leastBoughtItems.map(([, quantity]) => quantity),
        backgroundColor: '#e74c3c',
      },
    ],
  };

  // 8. Dados para o gráfico de itens mais caros
  const mostExpensiveData = {
    labels: mostExpensiveItems.map(([name]) => name),
    datasets: [
      {
        label: 'Preço Unitário (R$)',
        data: mostExpensiveItems.map(([, price]) => price),
        backgroundColor: '#9b59b6',
      },
    ],
  };

  // 9. Dados para o gráfico de itens mais baratos
  const leastExpensiveData = {
    labels: leastExpensiveItems.map(([name]) => name),
    datasets: [
      {
        label: 'Preço Unitário (R$)',
        data: leastExpensiveItems.map(([, price]) => price),
        backgroundColor: '#f39c12',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard de Compras</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Gasto Total</h3>
          <p>R$ {totalSpent.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Total de Compras</h3>
          <p>{purchaseHistory.length}</p>
        </div>
        <div className="metric-card">
          <h3>Item Mais Comprado</h3>
          <p>{sortedItems.length > 0 ? sortedItems[0][0] : 'N/A'}</p>
        </div>
        <div className="metric-card">
          <h3>Item Menos Comprado</h3>
          <p>{leastBoughtItems.length > 0 ? leastBoughtItems[0][0] : 'N/A'}</p>
        </div>
        <div className="metric-card">
          <h3>Item Mais Caro</h3>
          <p>{mostExpensiveItems.length > 0 ? mostExpensiveItems[0][0] : 'N/A'}</p>
        </div>
        <div className="metric-card">
          <h3>Item Mais Barato</h3>
          <p>{leastExpensiveItems.length > 0 ? leastExpensiveItems[0][0] : 'N/A'}</p>
        </div>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Gastos ao Longo do Tempo</h3>
          <Line data={spendingOverTimeData} />
        </div>
        <div className="chart-card">
          <h3>Top 5 Itens Mais Comprados</h3>
          <Bar data={topItemsData} />
        </div>
        <div className="chart-card">
          <h3>Top 5 Itens Menos Comprados</h3>
          <Bar data={leastBoughtData} />
        </div>
        <div className="chart-card">
          <h3>Top 5 Itens Mais Caros</h3>
          <Bar data={mostExpensiveData} />
        </div>
        <div className="chart-card">
          <h3>Top 5 Itens Mais Baratos</h3>
          <Bar data={leastExpensiveData} />
        </div>
      </div>
    </div>
  );
}
