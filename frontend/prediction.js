class PredictionModel {
    /**
     * Integrates Gemini AI for prediction if API key is present.
     * Otherwise falls back to Linear Regression.
     */
    static async getAdvancedPrediction(data, coinId, apiKey = null) {
        if (!apiKey) {
            console.log("Using Linear Regression (Fallback)");
            return this.predictNext(data);
        }

        try {
            const prompt = `Analyze this 30-day historical price data for ${coinId}: ${data.join(', ')}. Base on market trends, what is the most likely next price point? Return ONLY the numerical value.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            const predictedPrice = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            return isNaN(predictedPrice) ? this.predictNext(data) : predictedPrice;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return this.predictNext(data);
        }
    }

    /**
     * Simple Linear Regression to predict the next price point.
     * y = mx + b
     */
    static predictNext(data) {
        if (data.length < 2) return null;

        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += data[i];
            sumXY += i * data[i];
            sumX2 += i * i;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predict for the next index (n)
        return slope * n + intercept;
    }

    /**
     * Calculates Simple Moving Average
     */
    static calculateSMA(data, period = 7) {
        if (data.length < period) return null;
        const slice = data.slice(-period);
        return slice.reduce((a, b) => a + b) / period;
    }
}

async function fetchHistoricalData(coinId = 'bitcoin', days = 30) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
        const data = await response.json();
        
        // Return only the prices array (timestamp, price)
        return {
            prices: data.prices.map(p => p[1]),
            labels: data.prices.map(p => new Date(p[0]).toLocaleDateString()),
            raw: data.prices
        };
    } catch (error) {
        console.error("Error fetching market data:", error);
        return null;
    }
}

async function fetchCurrentPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
        return await response.json();
    } catch (error) {
        console.error("Error fetching current prices:", error);
        return null;
    }
}
