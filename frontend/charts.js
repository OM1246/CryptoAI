let priceChartInstance = null;

function initChart(labels, data, coinName) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 210, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');

    if (priceChartInstance) {
        priceChartInstance.destroy();
    }

    priceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${coinName} Price (USD)`,
                data: data,
                borderColor: '#00d2ff',
                backgroundColor: gradient,
                fill: true,
                tension: 0.1, // Reduced tension for better performance and look with high density
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00d2ff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(17, 25, 40, 0.9)',
                    titleColor: '#00d2ff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6, // Limit ticks to prevent overlap
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: false, // Ensure we focus on the price range
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        maxTicksLimit: 5,
                        font: {
                            size: 10
                        },
                        callback: function(value) {
                            if (value >= 1000) return '$' + (value/1000).toFixed(1) + 'k';
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}
