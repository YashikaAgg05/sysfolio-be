// Toggle Mode
document.getElementById('toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Re-render charts to apply dark mode text colors if they exist
  updateChartColors();
});

// Function to update chart colors based on dark mode
function updateChartColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#FFFFFF' : '#212529'; // White for dark mode, dark for light mode

    // Update Sector Pie Chart
    if (window.sectorChartInstance) { // Check if the chart instance exists
        window.sectorChartInstance.options.plugins.legend.labels.color = textColor;
        window.sectorChartInstance.options.plugins.title.color = textColor; // Ensure title color is updated
        window.sectorChartInstance.update();
    }

    // Update Profit/Loss Line Chart
    if (window.profitLossChartInstance) { // Check if the chart instance exists
        window.profitLossChartInstance.options.plugins.legend.labels.color = textColor;
        window.profitLossChartInstance.options.plugins.title.color = textColor; // Ensure title color is updated
        // Update scales (axes) text color
        window.profitLossChartInstance.options.scales.x.ticks.color = textColor;
        window.profitLossChartInstance.options.scales.y.ticks.color = textColor;
        window.profitLossChartInstance.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        window.profitLossChartInstance.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        window.profitLossChartInstance.update();
    }
}


// Last 5 investments
fetch('/api/investments')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#last-investments tbody');
    tbody.innerHTML = '';
    data.slice(-5).reverse().forEach(inv => {
      const row = `<tr>
        <td>${inv.company}</td>
        <td>${inv.symbol}</td>
        <td>₹${inv.amount_invested}</td>
        <td>₹${inv.current_value}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  });

// Portfolio summary section
fetch('/api/portfolio-status')
  .then(res => res.json())
  .then(data => {
    const profit = data.profit_loss;
    const total = data.total_invested;
    const current = data.total_current;

    // Update values
    document.getElementById('total-invested').innerText = `₹${total}`;
    document.getElementById('current-value').innerText = `₹${current}`;

    const profitElem = document.getElementById('profit-loss');
    profitElem.innerText = `₹${profit}`;

    // Apply color based on value
    profitElem.classList.remove('text-success', 'text-danger', 'text-secondary');
    if (profit > 0) profitElem.classList.add('text-success');
    else if (profit < 0) profitElem.classList.add('text-danger');
    else profitElem.classList.add('text-secondary');
  });

// Sector Pie Chart
fetch('/api/chart-data')
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => d.sector);
    const values = data.map(d => d.total);
    window.sectorChartInstance = new Chart(document.getElementById('sectorChart'), { // Store instance in global scope
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sectors',
          data: values,
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
            '#20c997', '#fd7e14', '#17a2b8', '#6610f2'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#212529' // Default light mode color
            }
          },
          title: { // Add title plugin options
            display: true,
            text: 'Sector-wise Pie Chart', // Set title text
            color: '#212529' // Default light mode color
          }
        }
      }
    });
    updateChartColors(); // Apply initial colors
  });

// Profit/Loss Monthly Chart
window.profitLossChartInstance = new Chart(document.getElementById('profitLossChart'), { // Store instance in global scope
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Profit',
      data: [3000, 2000, 5000, 4000, 6000, 4500],
      borderColor: '#28a745',
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#212529' // Default light mode color
        }
      },
      title: { // Add title plugin options
        display: true,
        text: 'Profit/Loss Monthly', // Set title text
        color: '#212529' // Default light mode color
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#212529' // Default light mode color for x-axis ticks
        },
        grid: {
            color: 'rgba(0, 0, 0, 0.1)' // Default light mode color for x-axis grid lines
        }
      },
      y: {
        ticks: {
          color: '#212529' // Default light mode color for y-axis ticks
        },
        grid: {
            color: 'rgba(0, 0, 0, 0.1)' // Default light mode color for y-axis grid lines
        }
      }
    }
  }
});
updateChartColors(); // Apply initial colors