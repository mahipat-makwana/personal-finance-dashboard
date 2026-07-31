//Transaction Form Working And Recent Transaction Table Section

//Transaction List
const transactionList = document.querySelector("#transaction-list");

// Transaction data
const transactions = [];

//DOM element
const transactionForm = document.querySelector("#transaction-form");

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedType = document.querySelector(
    'input[name="transaction-type"]:checked',
  ).value;

  const transaction = {
    id: Date.now(),
    type: selectedType,
    description: document.querySelector("#description").value.trim(),
    amount: Number(document.querySelector("#amount").value),
    category: document.querySelector("#category").value,
    date: document.querySelector("#date").value,
  };

  transactions.push(transaction);

  renderTransactions(getFilteredTransactions());
  transactionForm.reset();

  //update summary card
  updateSummary();
});

function renderTransaction(transaction) {
  const row = document.createElement("tr");

  const dateCell = document.createElement("td");
  dateCell.textContent = transaction.date;

  const descriptionCell = document.createElement("td");
  descriptionCell.textContent = transaction.description;

  const categoryCell = document.createElement("td");
  categoryCell.textContent = transaction.category;

  const typeCell = document.createElement("td");
  const typeBadge = document.createElement("span");

  typeBadge.className =
    transaction.type === "income"
      ? "badge text-bg-success"
      : "badge text-bg-danger";

  typeBadge.textContent = transaction.type === "income" ? "Income" : "Expense";

  typeCell.append(typeBadge);

  const amountCell = document.createElement("td");
  amountCell.className =
    transaction.type === "income"
      ? "text-end text-success fw-bold"
      : "text-end text-danger fw-bold";

  amountCell.textContent = `Rs. ${transaction.amount.toFixed(2)}`;

  const actionCell = document.createElement("td");
  actionCell.className = "text-end";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className =
    "btn btn-sm btn-outline-danger delete-transaction-btn";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.id = transaction.id;

  actionCell.append(deleteButton);

  row.append(
    dateCell,
    descriptionCell,
    categoryCell,
    typeCell,
    amountCell,
    actionCell,
  );

  transactionList.append(row);
}

transactionList.addEventListener("click", function (event) {
  if (!event.target.matches(".delete-transaction-btn")) {
    return;
  }

  const transactionId = Number(event.target.dataset.id);

  const transactionIndex = transactions.findIndex((transaction) => {
    return transaction.id === transactionId;
  });

  if (transactionIndex === -1) return;
  transactions.splice(transactionIndex, 1);

  renderTransactions(getFilteredTransactions());

  //update summary card
  updateSummary();
});

// Three Summary Card Section

//Summary Card QuerySelectors
const balanceElement = document.querySelector("#balance");
const incomeElement = document.querySelector("#income");
const expenseElement = document.querySelector("#expense");

function updateSummary() {
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "income",
  );

  const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const totalExpense = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const totalBalance = totalIncome - totalExpense;

  balanceElement.textContent = `Rs. ${totalBalance.toFixed(2)}`;
  incomeElement.textContent = `Rs. ${totalIncome.toFixed(2)}`;
  expenseElement.textContent = `Rs. ${totalExpense.toFixed(2)}`;
}

//Recent Transaction Filter Buttons
let currentFilter = "all";

//Query Selector
const filterButtons = document.querySelectorAll("[data-filter]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("btn-primary");
      filterButton.classList.add("btn-outline-primary");
    });

    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-primary");

    currentFilter = button.dataset.filter;
    renderTransactions(getFilteredTransactions());
  });
});

//Reusable Helper Function
function getFilteredTransactions() {
  if (currentFilter === "all") {
    return transactions;
  }
  return transactions.filter((transaction) => {
    return transaction.type === currentFilter;
  });
}

function renderTransactions(transactionArray) {
  transactionList.innerHTML = "";

  if (transactionArray.length === 0) {
    let emptyMessage;
    if (transactions.length === 0) {
      emptyMessage = "No transactions yet. Add one using the form above.";
    } else {
      emptyMessage = "No matching transactions found.";
    }

    const filterEmptyStateRow = document.createElement("tr");

    const filterEmptyStateText = document.createElement("td");
    filterEmptyStateText.colSpan = "6";
    filterEmptyStateText.className = "text-center text-muted py-4";
    filterEmptyStateText.textContent = emptyMessage;

    filterEmptyStateRow.append(filterEmptyStateText);
    transactionList.append(filterEmptyStateRow);
    return;
  }

  transactionArray.forEach((transaction) => {
    renderTransaction(transaction);
  });
}
