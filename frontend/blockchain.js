const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default Hardhat local address
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

async function logPrediction(coin, price) {
    if (!contract) return;

    try {
        // Convert price to integer for storage (USD * 100 to keep 2 decimals)
        const priceToStore = Math.round(price * 100);
        const tx = await contract.storePrediction(coin, priceToStore);
        await tx.wait();
        console.log("Prediction logged to blockchain!");
        loadPredictionHistory();
    } catch (error) {
        console.error("Blockchain logging failed:", error);
    }
}

async function loadPredictionHistory() {
    if (!contract) return;

    try {
        const history = await contract.getPredictions();
        const tbody = document.getElementById('historyBody');
        tbody.innerHTML = '';

        // Reverse to show latest first
        [...history].reverse().forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.timestamp * 1000).toLocaleString();
            const price = (log.predictedPrice / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
            
            row.innerHTML = `
                <td><span class="addr-tag">${log.predictor.substring(0, 10)}...</span></td>
                <td>${log.coin.toUpperCase()}</td>
                <td class="neon-text">$${price}</td>
                <td>${date}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to load history:", error);
    }
}
