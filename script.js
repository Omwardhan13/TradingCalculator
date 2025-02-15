document.addEventListener("DOMContentLoaded", () => {
      toggleInputs("quantityType", "lotQuantity", "fiatQuantity", "leverageContainer");
      toggleInputs("slQuantityType", "slLotQuantity", "slFiatQuantity", "slLeverageContainer");
    });

    // Tab switching functionality
    function switchTab(tab) {
      const pnlTab = document.getElementById('pnlTab');
      const slTab = document.getElementById('slTab');
      const pnlCalculator = document.getElementById('pnlCalculator');
      const slCalculator = document.getElementById('slCalculator');

      if (tab === 'pnl') {
        pnlTab.classList.add('tab-active');
        slTab.classList.remove('tab-active');
        pnlCalculator.classList.remove('hidden');
        slCalculator.classList.add('hidden');
      } else {
        slTab.classList.add('tab-active');
        pnlTab.classList.remove('tab-active');
        slCalculator.classList.remove('hidden');
        pnlCalculator.classList.add('hidden');
      }
    }

    function toggleInputs(selectId, lotContainerId, fiatContainerId, leverageContainerId) {
      const type = document.getElementById(selectId).value;
      const isLot = type === "lot";
      document.getElementById(fiatContainerId).style.display = isLot ? "none" : "block";
      document.getElementById(lotContainerId).style.display = isLot ? "block" : "none";
      document.getElementById(leverageContainerId).style.display = isLot ? "none" : "block";
    }

    document.getElementById("quantityType").addEventListener("change", () => {
      toggleInputs("quantityType", "lotQuantity", "fiatQuantity", "leverageContainer");
    });

    document.getElementById("slQuantityType").addEventListener("change", () => {
      toggleInputs("slQuantityType", "slLotQuantity", "slFiatQuantity", "slLeverageContainer");
    });

    function calculatePnl() {
      const entry = parseFloat(document.getElementById("entryPrice").value);
      const exit = parseFloat(document.getElementById("exitPrice").value);
      const quantityType = document.getElementById("quantityType").value;
      const currencyRate = parseFloat(document.getElementById("currencyRate").value);

      let quantityUSD, leverage;
      if (quantityType === "lot") {
        const lotSize = parseFloat(document.getElementById("lotSize").value) || 0.001;
        const lotAmount = parseFloat(document.getElementById("lotAmount").value) || 1;
        quantityUSD = lotSize * entry * lotAmount;
        leverage = 1;
      } else {
        const quantity = parseFloat(document.getElementById("quantity").value);
        quantityUSD = quantityType === "inr" ? quantity / currencyRate : quantity;
        leverage = parseFloat(document.getElementById("leverage").value);
      }

      const priceChange = (exit - entry) / entry;
      const pnlUSD = quantityUSD * priceChange * leverage;
      const pnlINR = pnlUSD * currencyRate;

      const resultElement = document.getElementById("result");
      
      if (pnlINR > 0) {
        resultElement.innerHTML = `<span class="text-green-500">Profit: ₹${pnlINR.toFixed(2)} ($${pnlUSD.toFixed(2)})</span>`;
      } else {
        resultElement.innerHTML = `<span class="text-red-500">Loss: ₹${Math.abs(pnlINR).toFixed(2)} ($${Math.abs(pnlUSD).toFixed(2)})</span>`;
      }
    }

    function calculateExitPrice() {
      const entry = parseFloat(document.getElementById("slEntryPrice").value);
      const desiredAmount = parseFloat(document.getElementById("desiredAmount").value);
      const quantityType = document.getElementById("slQuantityType").value;
      const currencyRate = parseFloat(document.getElementById("slCurrencyRate").value);

      let positionSize, leverage;
      if (quantityType === "lot") {
        const lotSize = parseFloat(document.getElementById("slLotSize").value) || 0.001;
        const lotAmount = parseFloat(document.getElementById("slLotAmount").value) || 1;
        positionSize = lotSize * entry * lotAmount;
        leverage = 1;
      } else {
        const amount = parseFloat(document.getElementById("slQuantity").value);
        positionSize = quantityType === "inr" ? amount / currencyRate : amount;
        leverage = parseFloat(document.getElementById("slLeverage").value);
      }

      const direction = document.getElementById("direction").value;
      const requiredProfitUSD = desiredAmount / currencyRate;
      const priceChange = requiredProfitUSD / (positionSize * leverage);

      const exitPrice = direction === "long" 
        ? entry * (1 + priceChange) 
        : entry * (1 - priceChange);

      const resultElement = document.getElementById("exitPriceResult");
      resultElement.innerHTML = `Required Exit Price: ${exitPrice.toFixed(2)} USD`;
    }
