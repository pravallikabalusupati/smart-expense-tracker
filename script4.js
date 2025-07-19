 const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const inc = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const exp = (amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = total;
  income.innerText = inc;
  expense.innerText = exp;
}

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionDOM);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionList.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = amountInput.value.trim();

  if (text === '' || amount === '') {
    alert('Please enter both description and amount');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text,
    amount: +amount
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  textInput.value = '';
  amountInput.value = '';
});

function init() {
  renderTransactions();
  updateValues();
}

init();

