
const API_KEY = 'd290t0hr01qvka4rjcfgd290t0hr01qvka4rjcg0'; // Replace with your real key
const stockSymbols = [
 // "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NFLX", "NVDA", "INTC", "IBM"
  // Add more symbols if needed

  "AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "TSLA", "META", "NVDA", "NFLX", "INTC",
  "AMD", "BABA", "ORCL", "IBM", "UBER", "LYFT", "PYPL", "ADBE", "CRM", "SHOP",
  "TWLO", "SQ", "ZM", "ROKU", "SNOW", "PLTR", "COIN", "ETSY", "DOCU", "FSLY",
  "PINS", "EBAY", "WMT", "TGT", "COST", "MCD", "SBUX", "PEP", "KO", "NKE",
  "DIS", "WBA", "CVS", "JNJ", "PFE", "MRNA", "ABBV", "UNH", "GILD", "LLY",
  "BA", "GE", "F", "GM", "CAT", "MMM", "DE", "HON", "LMT", "RTX",
  "XOM", "CVX", "BP", "COP", "PSX", "OXY", "SLB", "HAL", "EOG", "DVN",
  "JPM", "BAC", "WFC", "C", "GS", "MS", "AXP", "USB", "PNC", "TD",
  "V", "MA", "SQ", "PYPL", "INTU", "ADP", "SPGI", "ICE", "NDAQ", "TROW",
  "T", "VZ", "TMUS", "CMCSA", "CHTR", "DISH", "ATVI", "EA", "TTWO", "PARA"
];

// Load all stock data on page load
fetchStocks();

// Toggle Mode
document.getElementById('toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Re-render charts to apply dark mode text colors if they exist
  //updateChartColors();
});

async function fetchStocks() {
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";

  for (const symbol of stockSymbols) {
    try {
      const [quoteData, profileData] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`).then(res => res.json()),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`).then(res => res.json())
      ]);

      const row = `
        <tr>
          <td>${profileData.name || "N/A"}</td>
          <td>${profileData.ticker || symbol}</td>
          <td>${profileData.finnhubIndustry || "N/A"}</td>
          <td>${quoteData.c || "N/A"}</td>
          <td>${quoteData.h || "N/A"}</td>
          <td>${quoteData.l || "N/A"}</td>
          <td>${getMovementArrow(quoteData)}</td>
        </tr>
      `;
      tbody.innerHTML += row;

    } catch (error) {
      console.error(`Failed to fetch for ${symbol}:`, error);
    }
  }
}

function getMovementArrow(quoteData) {
  const current = parseFloat(quoteData.c);
  const open = parseFloat(quoteData.o);
  if (isNaN(current) || isNaN(open)) return "❓";
  return current > open ? "📈" : "📉";
}
