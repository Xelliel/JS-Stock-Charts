async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    // Function to fetch stock data from Twelve Data API
    async function fetchStockData(symbol) {
        const apiKey = 'YOUR_TWELVE_DATA_API_KEY';
        const apiUrl = 'https://api.twelvedata.com';
        const endpoint = `${apiUrl}/time_series?symbol=${symbol}&interval=1day&outputsize=5&apikey=${apiKey}`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Fetch data for symbols (adjust symbols array as needed)
    const symbols = ['AAPL', 'MSFT', 'GOOGL']; // Example symbols (stock tickers)
    const promises = symbols.map(symbol => fetchStockData(symbol));
    const results = await Promise.all(promises);

    // Process the results (assuming the data structure matches your needs)
    const datasets = results.map((result, index) => ({
        label: symbols[index],
        data: result?.values.map(entry => entry.close) || [], // Assuming 'close' is the relevant price
        borderColor: getRandomColor(),
        fill: false
    }));

    // Time Chart
    new Chart(timeChartCanvas, {
        type: 'line',
        data: {
            labels: results[0]?.values.map(entry => entry.datetime) || [], // Assuming 'datetime' for labels
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // Highest Price Chart (example, adjust as per your needs)
    new Chart(highestPriceChartCanvas, {
        type: 'bar',
        data: {
            labels: symbols,
            datasets: datasets.map(dataset => ({
                label: dataset.label,
                data: [Math.max(...dataset.data)],
                backgroundColor: getRandomColor()
            }))
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Average Price Chart (example, adjust as per your needs)
    new Chart(averagePriceChartCanvas, {
        type: 'line',
        data: {
            labels: symbols,
            datasets: datasets.map(dataset => ({
                label: dataset.label,
                data: [dataset.data.reduce((acc, val) => acc + val, 0) / dataset.data.length],
                borderColor: getRandomColor(),
                fill: false
            }))
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Helper function to generate random colors
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Call main function to start fetching data and rendering charts
main();
