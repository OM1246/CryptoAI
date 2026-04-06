const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = [
    "function storePrediction(string coin, uint256 predictedPrice) public",
    "function getPredictions() public view returns (tuple(address predictor, string coin, uint256 predictedPrice, uint256 timestamp)[])",
    "event PredictionStored(address indexed predictor, string coin, uint256 predictedPrice, uint256 timestamp)"
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            
            contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            
            updateWalletUI(address);
            loadPredictionHistory();
            return true;
        } catch (error) {
            console.error("User rejected connection or error occurred:", error);
            if (error.code === -32002) {
                alert("MetaMask request already pending. Please check your MetaMask extension.");
            }
            return false;
        }
    } else {
        alert("MetaMask not found! Please install the MetaMask extension.");
        return false;
    }
}

function updateWalletUI(address) {
    const btnText = document.querySelector('#connectWallet .btn-text');
    btnText.innerText = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    document.getElementById('connectWallet').classList.add('connected');
    document.getElementById('savePrediction').disabled = false;
}

let localHistory = []; // Fallback local logic

async function logPrediction(coin, price) {
    const priceToStore = Math.round(price * 100);

    if (!contract) {
        const pseudoAddress = "0x" + Math.random().toString(16).slice(2, 12).padEnd(40, '0');
        localHistory.push({
            predictor: pseudoAddress,
            coin: coin,
            predictedPrice: priceToStore,
            timestamp: Math.floor(Date.now() / 1000)
        });
        console.log("Prediction logged locally (Wallet not connected)!");
        loadPredictionHistory();
        return;
    }

    try {
        const tx = await contract.storePrediction(coin, priceToStore);
        await tx.wait(); // Wait for transaction confirmation
        console.log("Prediction successfully logged to blockchain!");
        loadPredictionHistory(); // Reload history directly from contract
    } catch (error) {
        console.error("Blockchain logging failed:", error);
        alert("Blockchain logging failed. Make sure your Hardhat node is running and MetaMask is properly connected.");
    }
}

async function loadPredictionHistory() {
    let history = localHistory;
    
    if (contract) {
        try {
            history = await contract.getPredictions();
        } catch (error) {
            console.error("Failed to load history from contract:", error);
            return;
        }
    }

    try {
        const tbody = document.getElementById('historyBody');
        tbody.innerHTML = '';

        [...history].reverse().forEach(log => {
            const row = document.createElement('tr');
            
            // Fix for BigNumber from ethers.js vs local Number
            const timestamp = log.timestamp.toNumber ? log.timestamp.toNumber() : log.timestamp;
            const predictedPrice = log.predictedPrice.toNumber ? log.predictedPrice.toNumber() : log.predictedPrice;
            
            const date = new Date(timestamp * 1000).toLocaleString();
            const price = (predictedPrice / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
            
            row.innerHTML = `
                <td><span class="addr-tag">${log.predictor.substring(0, 10)}...</span></td>
                <td>${log.coin.toUpperCase()}</td>
                <td class="neon-text">$${price}</td>
                <td>${date}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to render history:", error);
    }
}

