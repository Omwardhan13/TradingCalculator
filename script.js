document.addEventListener('DOMContentLoaded', function() {
    // PnL Calculator Form
    const pnlForm = document.getElementById('pnlForm');
    const pnlResult = document.getElementById('pnlResult');
    const pnlUsd = document.getElementById('pnlUsd');
    const pnlInr = document.getElementById('pnlInr');

    // Exit Price Calculator Form
    const exitForm = document.getElementById('exitForm');
    const exitResult = document.getElementById('exitResult');
    const exitPriceElement = document.getElementById('exitPrice');

    // PnL Calculator
    pnlForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const currentPrice = parseFloat(document.getElementById('currentPrice').value);
        const leverage = parseFloat(document.getElementById('leverage').value);
        const lotValue = parseFloat(document.getElementById('lotValue').value);
        const lotSize = parseFloat(document.getElementById('lotSize').value);
        const usdInrRate = parseFloat(document.getElementById('usdInrRate').value);
        const position = document.querySelector('input[name="position"]:checked').value;

        if (!validateInputs([entryPrice, currentPrice, leverage, lotValue, lotSize, usdInrRate])) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        // Calculate total trade value (with leverage)
        const tradeValue = lotSize * lotValue * entryPrice * leverage;
        const tradeValueInr = tradeValue * usdInrRate;
        document.getElementById('tradeValue').textContent = `$${tradeValue.toFixed(2)}`;
        document.getElementById('tradeValueInr').textContent = `₹${tradeValueInr.toFixed(2)}`;

        // Calculate PnL without leverage
        let pnl;
        if (position === 'long') {
            pnl = (currentPrice - entryPrice) * lotSize * lotValue;
        } else {
            pnl = (entryPrice - currentPrice) * lotSize * lotValue;
        }
        const pnlInrValue = pnl * usdInrRate;

        pnlUsd.textContent = `$${pnl.toFixed(2)}`;
        pnlInr.textContent = `₹${pnlInrValue.toFixed(2)}`;
        pnlUsd.classList.remove('text-success', 'text-danger');
        pnlInr.classList.remove('text-success', 'text-danger');

        if (pnl > 0) {
            pnlUsd.classList.add('text-success');
            pnlInr.classList.add('text-success');
        } else if (pnl < 0) {
            pnlUsd.classList.add('text-danger');
            pnlInr.classList.add('text-danger');
        }

        pnlResult.style.display = 'block';
    });

    // Exit Price Calculator
    exitForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const entryPrice = parseFloat(document.getElementById('exitEntryPrice').value);
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        const position = document.querySelector('input[name="exitPosition"]:checked').value;
        const currency = document.querySelector('input[name="profitCurrency"]:checked').value;
        const usdInrRate = parseFloat(document.getElementById('exitUsdInrRate').value);
        const lotValue = parseFloat(document.getElementById('exitLotValue').value);
        const lotSize = parseFloat(document.getElementById('exitLotSize').value);

        if (!validateInputs([entryPrice, targetAmount, lotValue, lotSize])) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        let targetUsd = targetAmount;
        if (currency === 'inr') {
            targetUsd = targetAmount / usdInrRate;
        }

        // Calculate exit price based on target profit/loss per unit
        const targetPerUnit = targetUsd / (lotSize * lotValue);
        let exitPrice;
        if (position === 'long') {
            exitPrice = entryPrice + targetPerUnit;
        } else {
            exitPrice = entryPrice - targetPerUnit;
        }

        exitPriceElement.textContent = `$${exitPrice.toFixed(2)}`;
        exitResult.style.display = 'block';
    });

    // Form Reset Handlers
    pnlForm.addEventListener('reset', function() {
        pnlResult.style.display = 'none';
        document.getElementById('tradeValue').textContent = '$0.00';
        document.getElementById('tradeValueInr').textContent = '₹0.00';
    });

    exitForm.addEventListener('reset', function() {
        exitResult.style.display = 'none';
    });

    // Input Validation
    function validateInputs(inputs) {
        return inputs.every(input => {
            return !isNaN(input) && input > 0;
        });
    }

    // Real-time validation
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
            if (this.validity.valid) {
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
            }
        });
    });

    // Real-time trade value calculation
    const tradeValueInputs = ['entryPrice', 'lotValue', 'lotSize', 'leverage'];
    tradeValueInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function() {
            const entryPrice = parseFloat(document.getElementById('entryPrice').value) || 0;
            const lotValue = parseFloat(document.getElementById('lotValue').value) || 0;
            const lotSize = parseFloat(document.getElementById('lotSize').value) || 0;
            const leverage = parseFloat(document.getElementById('leverage').value) || 1;
            const usdInrRate = parseFloat(document.getElementById('usdInrRate').value) || 85;

            const tradeValue = lotSize * lotValue * entryPrice * leverage;
            const tradeValueInr = tradeValue * usdInrRate;
            document.getElementById('tradeValue').textContent = `$${tradeValue.toFixed(2)}`;
            document.getElementById('tradeValueInr').textContent = `₹${tradeValueInr.toFixed(2)}`;
        });
    });

    // Currency symbol toggle for target amount
    const profitCurrencyRadios = document.querySelectorAll('input[name="profitCurrency"]');
    const targetCurrencySymbol = document.getElementById('targetCurrencySymbol');

    profitCurrencyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            targetCurrencySymbol.textContent = this.value === 'usd' ? '$' : '₹';
        });
    });
});