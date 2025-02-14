document.getElementById('quantityType').addEventListener('change', function() {
    const type = this.value;
    document.getElementById('fiatQuantity').style.display = type === 'lot' ? 'none' : 'block';
    document.getElementById('lotQuantity').style.display = type === 'lot' ? 'block' : 'none';
});

function calculatePnl() {
    const entry = parseFloat(document.getElementById('entryPrice').value);
    const exit = parseFloat(document.getElementById('exitPrice').value);
    const leverage = parseInt(document.getElementById('leverage').value);
    const quantityType = document.getElementById('quantityType').value;
    const currencyRate = parseFloat(document.getElementById('currencyRate').value);
    
    let quantityUSD;
    if(quantityType === 'inr') {
        const quantity = parseFloat(document.getElementById('quantity').value);
        quantityUSD = quantity / currencyRate;
    } else if(quantityType === 'usd') {
        quantityUSD = parseFloat(document.getElementById('quantity').value);
    } else { // Lot
        const lotMultiplier = parseFloat(document.getElementById('lotMultiplier').value) || 0.001;
        const lotAmount = parseFloat(document.getElementById('lotAmount').value) || 1;
        quantityUSD = lotMultiplier * entry * lotAmount;
    }

    const priceChange = (exit - entry) / entry;
    const pnlUSD = quantityUSD * priceChange * leverage;
    const pnlINR = pnlUSD * currencyRate;

    let result;
    if(quantityType === 'inr') {
        result = `Profit/Loss: ₹${pnlINR.toFixed(2)}<br>($${pnlUSD.toFixed(2)})`;
    } else {
        result = `Profit/Loss: $${pnlUSD.toFixed(2)}<br>(₹${pnlINR.toFixed(2)})`;
    }

    document.getElementById('result').innerHTML = result;
}

function calculateExitPrice() {
    const entry = parseFloat(document.getElementById('slEntryPrice').value);
    const desiredAmount = parseFloat(document.getElementById('desiredAmount').value);
    const leverage = parseInt(document.getElementById('slLeverage').value);
    const direction = document.getElementById('direction').value;
    const quantity = parseFloat(document.getElementById('slQuantity').value);
    const currencyRate = parseFloat(document.getElementById('slCurrencyRate').value);

    const quantityUSD = quantity / currencyRate;
    const requiredPriceChange = (desiredAmount / currencyRate) / (quantityUSD * leverage);
    
    let exitPrice;
    if(direction === 'long') {
        exitPrice = entry * (1 + requiredPriceChange);
    } else {
        exitPrice = entry * (1 - requiredPriceChange);
    }

    document.getElementById('exitPriceResult').innerHTML = 
        `Required Exit Price: ${exitPrice.toFixed(2)} USD`;
}
