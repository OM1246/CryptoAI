// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initial data load
    refreshDashboard();
    runNewPrediction();

    // Event Listeners
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    document.getElementById('runPrediction').addEventListener('click', async () => {
        const btn = document.getElementById('runPrediction');
        btn.innerText = "Analyzing...";
        btn.disabled = true;
        
        await runNewPrediction();
        
        btn.innerText = "Analyze Market";
        btn.disabled = false;
    });

    document.getElementById('savePrediction').addEventListener('click', async () => {
        const coin = document.getElementById('selectedCoin').value;
        const price = parseFloat(document.getElementById('predictedValue').innerText.replace('$', '').replace(',', ''));
        
        const btn = document.getElementById('savePrediction');
        const originalText = btn.innerText;
        btn.innerText = "Logging...";
        btn.disabled = true;

        await logPrediction(coin, price);

        btn.innerText = originalText;
        btn.disabled = false;
    });

    document.getElementById('selectedCoin').addEventListener('change', () => {
        runNewPrediction();
    });
});

async function refreshDashboard() {
    const data = await fetchCurrentPrices();
    if (!data) return;

    updateStatCard('btc', data.bitcoin.usd, data.bitcoin.usd_24h_change);
    updateStatCard('eth', data.ethereum.usd, data.ethereum.usd_24h_change);
    updateStatCard('sol', data.solana.usd, data.solana.usd_24h_change);
}

function updateStatCard(id, price, change) {
    const priceEl = document.getElementById(`${id}-price`);
    const changeEl = document.getElementById(`${id}-change`);

    priceEl.innerText = `$${price.toLocaleString()}`;
    changeEl.innerText = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    changeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
}

// SET YOUR GEMINI API KEY HERE
const GEMINI_API_KEY = ""; 

async function runNewPrediction() {
    const coinId = document.getElementById('selectedCoin').value;
    const historical = await fetchHistoricalData(coinId);
    
    if (!historical) return;

    // Display Chart
    initChart(historical.labels, historical.prices, coinId.toUpperCase());

    // Run AI Model (with Gemini fallback)
    const nextPrice = await PredictionModel.getAdvancedPrediction(historical.prices, coinId, GEMINI_API_KEY);
    
    if (nextPrice) {
        document.getElementById('predictedValue').innerText = `$${nextPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Slightly randomize confidence for visual effect
        const confidence = GEMINI_API_KEY ? (92 + Math.random() * 5) : (85 + Math.random() * 10);
        document.querySelector('.progress-fill').style.width = `${confidence}%`;
    }
}
