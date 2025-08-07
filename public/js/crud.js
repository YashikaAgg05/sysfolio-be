
  
  
// // document.getElementById("buyForm").addEventListener("submit", async function (e) {
// //     e.preventDefault();
  
// //     const companySelect = document.getElementById("company");
// //     const symbolInput = document.getElementById("symbol");
// //     const sectorSelect = document.getElementById("sector");
// //     const priceInput = document.getElementById("price");
// //     const quantityInput = document.getElementById("quantity");
// //     const dateInput = document.getElementById("date");
// //     const remarksInput = document.getElementById("remarks");
  
// //     const data = {
// //       company: companySelect.value,
// //       symbol: symbolInput.value,
// //       sector: sectorSelect.value,
// //       price: parseFloat(priceInput.value),
// //       quantity: parseInt(quantityInput.value),
// //       date: dateInput.value,
// //       remarks: remarksInput.value
// //     };
  
// //     const res = await fetch("/buy", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data)
// //     });
  
// //     const result = await res.json();
  
// //     if (result.success) {
// //       renderCard(result.data);
// //     } else {
// //       alert("Error: " + result.error);
// //     }
// //   });
  
// //   function renderCard(data) {
// //     const container = document.getElementById("cardContainer");
// //     const card = document.createElement("div");
// //     card.className = "card mb-3";
// //     card.innerHTML = `
// //       <div class="card-body">
// //         <h5 class="card-title">${data.company} (${data.symbol})</h5>
// //         <p class="card-text">Sector: ${data.sector}</p>
// //         <p class="card-text">Price: ₹${data.price}</p>
// //         <p class="card-text">Quantity: ${data.quantity}</p>
// //         <p class="card-text">Date: ${data.date}</p>
// //         <p class="card-text">Remarks: ${data.remarks}</p>
// //       </div>
// //     `;
// //     container.prepend(card);
// //   }
  


// // Fetch and show existing investments on load:
// document.addEventListener('DOMContentLoaded', fetchInvestments);

// async function fetchInvestments() {
//   const cards = document.getElementById('investmentCards');
//   cards.innerHTML = '<div style="grid-column: span 2;text-align:center;">Loading...</div>';
//   try {
//     const res = await fetch('/api/investments');
//     const data = await res.json();
//     if (Array.isArray(data)) {
//       renderCards(data.reverse());
//     } else {
//       cards.innerHTML = '<div>Error loading investments.</div>';
//     }
//   } catch {
//     cards.innerHTML = '<div>Could not load stocks.</div>';
//   }
// }

// function renderCards(list) {
//   const cards = document.getElementById('investmentCards');
//   if (!list.length) {
//     cards.innerHTML = '<div style="grid-column:span 2;color:#777;padding:26px 0;text-align:center;">No stocks bought yet.</div>';
//     return;
//   }
//   cards.innerHTML = list.map(inv => `
//     <div class="crud-card">
//       <div><span class="symbol">${inv.symbol}</span> <span style="color:#7977;">(${inv.sector})</span></div>
//       <div><strong>${inv.company || inv.company_name}</strong></div>
//       <div>Qty: <strong>${inv.quantity}</strong> @ ₹${Number(inv.price).toFixed(2)} each</div>
//       <div>Date: ${inv.date ? inv.date : '-'}</div>
//       <div>Invested: <strong>₹${(inv.price * inv.quantity).toLocaleString()}</strong></div>
//       ${inv.remarks ? `<div class="remarks">Note: ${inv.remarks}</div>` : ""}
//     </div>
//   `).join('');
// }

// // Form submission
// document.getElementById('buyForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const form = e.target;
//   const btn = form.querySelector('button[type=submit]');
//   btn.disabled = true;
//   btn.textContent = "Buying...";

//   // Build the payload in DB format (company, symbol, sector, price, quantity, date, remarks)
//   const payload = {
//     company: form.company.value.trim(),
//     symbol: form.symbol.value.trim().toUpperCase(),
//     sector: form.sector.value,
//     price: parseFloat(form.price.value),
//     quantity: parseInt(form.quantity.value),
//     date: form.date.value,
//     remarks: form.remarks.value.trim()
//   };

//   try {
//     const res = await fetch('/api/buy', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//     const result = await res.json();
//     if (result.success) {
//       // Add latest investment on top, refresh list
//       fetchInvestments();

//       form.reset();
//       btn.textContent = "Buy";
//       btn.disabled = false;
//     } else {
//       alert("Failed to add investment!");
//       btn.textContent = "Buy";
//       btn.disabled = false;
//     }
//   } catch (e) {
//     alert("Something went wrong!");
//     btn.textContent = "Buy";
//     btn.disabled = false;
//   }
// });


// --- COMPANY/SYMBOL MAP from share.html (about 100 companies, shortened example, paste your full list) ---
const companies = [
  { name: "Apple Inc", symbol: "AAPL", sector: "Technology" },
  { name: "Microsoft Corporation", symbol: "MSFT", sector: "Technology" },
  { name: "Amazon.com Inc", symbol: "AMZN", sector: "Consumer" },
  { name: "Alphabet Inc (Google)", symbol: "GOOGL", sector: "Technology" },
  { name: "Tesla Inc", symbol: "TSLA", sector: "Consumer" },
  { name: "Meta Platforms Inc", symbol: "META", sector: "Technology" },
  { name: "NVIDIA Corporation", symbol: "NVDA", sector: "Technology" },
  { name: "Intel Corporation", symbol: "INTC", sector: "Technology" },
  // ... Continue for all 100+ companies from your share.html ...
];

// Your Finnhub API key (match with what's in api.js/server.js)
const API_KEY = 'd290t0hr01qvka4rjcfgd290t0hr01qvka4rjcg0';

document.addEventListener('DOMContentLoaded', () => {
  // --- Populate the company dropdown ---
  const companySelect = document.getElementById('company');
  companySelect.innerHTML =
    `<option value="">Select a company</option>` +
    companies.map(c =>
      `<option value="${c.symbol}" data-sector="${c.sector}">${c.name}</option>`
    ).join('');

  // --- Default sector based on company if possible ---
  companySelect.addEventListener('change', async function() {
    const symbol = this.value;
    const company = companies.find(c => c.symbol === symbol);
    document.getElementById('company-symbol').value = symbol || '';
    document.getElementById('symbol').value = symbol || '';
    if (company) {
      document.getElementById('sector').value = company.sector || '';
      // Fetch live price
      showLivePrice(symbol);
    } else {
      document.getElementById('sector').value = '';
      document.getElementById('price').value = '';
      document.getElementById('livePrice').textContent = "Current Price: —";
    }
  });

  // --- Fill today's date by default ---
  const today = new Date();
  document.getElementById('date').value =
    today.toISOString().split('T')[0];

  // --- If page is reloaded after adding, default selected company and live price
  if (companySelect.value) {
    const evt = new Event('change');
    companySelect.dispatchEvent(evt);
  }

  // Toggle Mode
document.getElementById('toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Re-render charts to apply dark mode text colors if they exist
  //updateChartColors();
});

  // --- Fetch and display investments and setup form ---
  fetchInvestments();

  document.getElementById('buyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Buying...';

    const companyIdx = form.company.selectedIndex;
    const companyName = (companyIdx > 0)
      ? (form.company.options[companyIdx].text)
      : '';

    const payload = {
      company: companyName,
      symbol: form.symbol.value.trim().toUpperCase(),
      sector: form.sector.value,
      price: parseFloat(form.price.value),
      quantity: parseInt(form.quantity.value, 10),
      date: form.date.value,
      remarks: form.remarks.value.trim()
    };

    try {
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.success) {
        form.reset();
        // Set today's date again
        document.getElementById('date').value =
          new Date().toISOString().split('T')[0];
        // Reset placeholder for symbol, price, etc.
        document.getElementById('company-symbol').value = '';
        document.getElementById('price').value = '';
        document.getElementById('livePrice').textContent = "Current Price: —";
        fetchInvestments();
      } else {
        alert('Failed to add investment: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error adding investment. Please try again.');
      console.error(error);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Buy';
    }
  });
});

async function showLivePrice(symbol) {
  // Use the same endpoint as api.js
  // eg. https://finnhub.io/api/v1/quote?symbol=IBM&token=API_KEY
  const liveBadge = document.getElementById('livePrice');
  const priceInput = document.getElementById('price');
  if (!symbol) {
    liveBadge.textContent = "Current Price: —";
    priceInput.value = '';
    return;
  }
  liveBadge.textContent = "Current Price: Loading...";
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );
    const data = await res.json();
    const current = data.c || '';
    if (current) {
      liveBadge.textContent = `Current Price: ₹${Number(current).toFixed(2)}`;
      priceInput.value = Number(current).toFixed(2);
    } else {
      liveBadge.textContent = "Current Price: Not Found";
      priceInput.value = '';
    }
  } catch (e) {
    liveBadge.textContent = "Current Price: Error";
    priceInput.value = '';
  }
}

async function fetchInvestments() {
  const container = document.getElementById('investmentCards');
  container.innerHTML = '<div style="grid-column: span 2; text-align:center; color:#666;">Loading...</div>';
  try {
    const response = await fetch('/api/investments');
    const investments = await response.json();
    if (Array.isArray(investments) && investments.length > 0) {
      renderInvestments(investments.reverse());
    } else {
      container.innerHTML = '<div style="grid-column: span 2; text-align:center; color:#999; padding:30px 0;">No stocks bought yet.</div>';
    }
  } catch (error) {
    container.innerHTML = '<div style="grid-column: span 2; text-align:center; color:#f00; padding:30px 0;">Failed to load stocks.</div>';
    console.error(error);
  }
}

function renderInvestments(list) {
  const container = document.getElementById('investmentCards');
  container.innerHTML = list
    .map(inv => {
      const invested = (inv.price * inv.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `
        <div class="crud-card">
          <div class="symbol-row">
            <span class="symbol">${escapeHtml(inv.symbol || '')}</span>
            <span class="sector">${escapeHtml(inv.sector || '')}</span>
          </div>
          <div class="company">${escapeHtml(inv.company || '')}</div>
          <div class="info-row">
            <span>Qty: <strong>${inv.quantity}</strong></span>
            <span>₹${Number(inv.price).toFixed(2)} each</span>
          </div>
          <div class="info-row">
            <span>Date: ${escapeHtml(inv.date || '-')}</span>
          </div>
          <div class="amount">Invested: ₹${invested}</div>
          ${inv.remarks ? `<div class="remarks">Note: ${escapeHtml(inv.remarks)}</div>` : ''}
        </div>
      `;
    })
    .join('');
}

// Basic escape for HTML output
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m];
  });
}
