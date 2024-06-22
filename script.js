document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'nunniSriram' && password === '2310205') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('expense-tracker').style.display = 'block';
        displayExpenses();
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('show-form-btn').addEventListener('click', function() {
    const form = document.getElementById('expense-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const type = document.getElementById('type').value;

    if (date && amount && type) {
        addExpense(date, amount, type);
    }

    document.getElementById('date').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = '';
});

document.getElementById('filter-week').addEventListener('click', function() {
    filterExpenses('week');
});

document.getElementById('filter-year').addEventListener('click', function() {
    filterExpenses('year');
});

document.getElementById('clear-filter').addEventListener('click', function() {
    displayExpenses();
});

function addExpense(date, amount, type) {
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];

    expenses.push({ date, amount, type });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    displayExpenses();
}

function deleteExpense(date, amount, type, row) {
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];

    expenses = expenses.filter(expense => expense.date !== date || expense.amount !== amount || expense.type !== type);

    localStorage.setItem('expenses', JSON.stringify(expenses));
    row.remove();

    displayExpenses();
}

function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const groupedExpenses = groupByDate(expenses);

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = 'No transactions found.';
        noDataMsg.style.textAlign = 'center';
        expenseList.appendChild(noDataMsg);
        return;
    }

    Object.keys(groupedExpenses).forEach(date => {
        const dateExpenses = groupedExpenses[date];

        const container = document.createElement('div');
        container.classList.add('expense-container');

        const heading = document.createElement('h3');
        heading.textContent = formatDate(date);
        container.appendChild(heading);

        const table = document.createElement('table');
        table.classList.add('expense-table');

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        th1.textContent = 'Amount';
        tr.appendChild(th1);
        const th2 = document.createElement('th');
        th2.textContent = 'Type';
        tr.appendChild(th2);
        const th3 = document.createElement('th');
        th3.textContent = 'Actions';
        tr.appendChild(th3);
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        dateExpenses.forEach(expense => {
            const tr = document.createElement('tr');

            const tdAmount = document.createElement('td');
            tdAmount.textContent = `₹${expense.amount}`; // Adding ₹ symbol here
            tr.appendChild(tdAmount);

            const tdType = document.createElement('td');
            tdType.textContent = expense.type;
            tr.appendChild(tdType);

            const tdActions = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteExpense(expense.date, expense.amount, expense.type, tr);
            });
            tdActions.appendChild(deleteBtn);
            tr.appendChild(tdActions);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.appendChild(table);
        expenseList.appendChild(container);
    });
}

function groupByDate(expenses) {
    const grouped = {};
    expenses.forEach(expense => {
        const date = expense.date;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(expense);
    });
    return grouped;
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function filterExpenses(timeframe) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const now = new Date();
    let filteredExpenses = [];

    if (timeframe === 'week') {
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(now.getDate() - 14);

        filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= fourteenDaysAgo && expenseDate <= now;
        });
    } else if (timeframe === 'year') {
        const lastYear = now.getFullYear() - 1;
        filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === lastYear;
        });
    }

    const groupedExpenses = groupByDate(filteredExpenses);

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    if (filteredExpenses.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = `No transactions done in the previous ${timeframe === 'week' ? '14 days' : 'year'}.`;
        noDataMsg.style.textAlign = 'center';
        expenseList.appendChild(noDataMsg);
        return;
    }

    Object.keys(groupedExpenses).forEach(date => {
        const dateExpenses = groupedExpenses[date];

        const container = document.createElement('div');
        container.classList.add('expense-container');

        const heading = document.createElement('h3');
        heading.textContent = formatDate(date);
        container.appendChild(heading);

        const table = document.createElement('table');
        table.classList.add('expense-table');

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        th1.textContent = 'Amount';
        tr.appendChild(th1);
        const th2 = document.createElement('th');
        th2.textContent = 'Type';
        tr.appendChild(th2);
        const th3 = document.createElement('th');
        th3.textContent = 'Actions';
        tr.appendChild(th3);
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        dateExpenses.forEach(expense => {
            const tr = document.createElement('tr');

            const tdAmount = document.createElement('td');
            tdAmount.textContent = `₹${expense.amount}`; // Adding ₹ symbol here
            tr.appendChild(tdAmount);

            const tdType = document.createElement('td');
            tdType.textContent = expense.type;
            tr.appendChild(tdType);

            const tdActions = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteExpense(expense.date, expense.amount, expense.type, tr);
            });
            tdActions.appendChild(deleteBtn);
            tr.appendChild(tdActions);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.appendChild(table);
        expenseList.appendChild(container);
    });
}

document.addEventListener('DOMContentLoaded', displayExpenses);
