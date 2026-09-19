
const amountSlider   = document.getElementById('amountSlider');
const termSlider     = document.getElementById('termSlider');
const amountDisplay  = document.getElementById('amountDisplay');
const termDisplay    = document.getElementById('termDisplay');
const monthlyPayment = document.getElementById('monthlyPayment');
const formAmount     = document.getElementById('formAmount');
const formTerm       = document.getElementById('formTerm');
const formMonthly    = document.getElementById('formMonthly');

const ANNUAL_RATE  = 0.045;
const MONTHLY_RATE = ANNUAL_RATE / 12;

function calcMonthly(principal, months) {
  const r = MONTHLY_RATE;
  const n = months;
  const factor = Math.pow(1 + r, n);
  return principal * r * factor / (factor - 1);
}

function updateCalculator() {
  const amount = Number(amountSlider.value);
  const term   = Number(termSlider.value);
  const monthly = calcMonthly(amount, term);

  amountDisplay.textContent  = '$' + amount.toLocaleString();
  termDisplay.textContent    = term + ' months';
  monthlyPayment.textContent = '$' + monthly.toFixed(2);

  formAmount.value  = amount;
  formTerm.value    = term;
  formMonthly.value = monthly.toFixed(2);
}

amountSlider.addEventListener('input', updateCalculator);
termSlider.addEventListener('input', updateCalculator);
updateCalculator();

const form       = document.getElementById('applyForm');
const submitBtn  = document.getElementById('submitBtn');
const formMsg    = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  formMsg.textContent = '';

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');

    formMsg.style.color = '#0f8b5e';
    formMsg.textContent = '✅ Application received! We will contact you within 24 hours.';
    form.reset();
    updateCalculator();
  } catch (err) {
    formMsg.style.color = '#d64545';
    formMsg.textContent = '❌ ' + err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Apply Now';
  }
});
