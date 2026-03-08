// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptoPrediction {
    struct Prediction {
        address predictor;
        string coin;
        uint256 predictedPrice;
        uint256 timestamp;
    }

    Prediction[] public predictions;
    
    event PredictionStored(
        address indexed predictor,
        string coin,
        uint256 predictedPrice,
        uint256 timestamp
    );

    function storePrediction(string memory _coin, uint256 _predictedPrice) public {
        Prediction memory newPrediction = Prediction({
            predictor: msg.sender,
            coin: _coin,
            predictedPrice: _predictedPrice,
            timestamp: block.timestamp
        });

        predictions.push(newPrediction);

        emit PredictionStored(msg.sender, _coin, _predictedPrice, block.timestamp);
    }

    function getPredictions() public view returns (Prediction[] memory) {
        return predictions;
    }

    function getPredictionCount() public view returns (uint256) {
        return predictions.length;
    }
}
