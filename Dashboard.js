// Wait for the DOM to load before executing
document.addEventListener("DOMContentLoaded", function () {

    // Retrieve OneUser from localStorage
    let OneUser = JSON.parse(localStorage.getItem("OneUser")) || null;

    // Validate if OneUser is signed in
    if (!OneUser) {
        alert("User is not logged in. Redirecting to login page...");
        // Redirect to login page if user is not logged in
        window.location.href = "login.html"; // Replace with your actual login page URL
        return; // Stop execution if the user is not logged in
    }

    // Retrieve Income and Expenses for the signed-in user from localStorage
    let expIncData = JSON.parse(localStorage.getItem("OneUser")) || { Income: [], Expenses: [] };
    let Income = expIncData.Income || [];
    let Expenses = expIncData.Expenses || [];

    // Debugging: Check the first entry of Income and Expenses
    console.log(Income[0]);
    console.log(Expenses[0]);

    // Calculate totals for income, expenses, and balance
    let totalIncome = Income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let totalExpenses = Expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let balance = totalIncome - totalExpenses;

    // Update totals in the Dashboard
    document.querySelector('.summary .card:nth-child(1) p').textContent = `${totalIncome.toFixed(2)} Rs`;
    document.querySelector('.summary .card:nth-child(2) p').textContent = `${totalExpenses.toFixed(2)} Rs`;
    document.querySelector('.summary .card:nth-child(3) p').textContent = `${balance.toFixed(2)} Rs`;

    // Display recent transactions
    const transactionsContainer = document.getElementById("transactions");
    transactionsContainer.innerHTML = ''; // Clear previous transactions

    // Combine and sort transactions by latest first
    const allTransactions = [
        ...Income.map(transaction => ({ ...transaction, type: 'income' })),
        ...Expenses.map(transaction => ({ ...transaction, type: 'expense' }))
    ];

    // Sorting transactions by date (if date exists)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Show only the last 5 transactions
    const latestTransactions = allTransactions.slice(0, 5);

    // Create HTML elements for each transaction
    latestTransactions.forEach(transaction => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction");

        // Creating transaction HTML content
        transactionDiv.innerHTML = `
            <p><strong>${transaction.type.toUpperCase()}</strong> - ${transaction.category}</p>
            <p>${transaction.description ? transaction.description : ''}</p>
            <p>${transaction.amount} Rs</p>
        `;

        transactionsContainer.appendChild(transactionDiv);
    });

    // Button to navigate to form page
    let btn = document.getElementById("FillDetails");
    if (btn) {
        btn.addEventListener("click", () => {
            window.location.href = "./Form.html";
        });
    }

     // Button to navigate to form page
     let btn2 = document.getElementById("LogOut");
     if (btn2) {
         btn2.addEventListener("click", () => {
             window.location.href = "./Login.html";
         });
     }

    // Create charts
    const ctxIncome = document.getElementById('incomeChart').getContext('2d');
    const ctxExpense = document.getElementById('expenseChart').getContext('2d');

    // Prepare data for income chart
    const incomeCategories = Income.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    // Get labels and data for income chart
    const incomeLabels = Object.keys(incomeCategories);
    const incomeData = Object.values(incomeCategories);

    // Show only the last 5 income categories
    const recentIncomeLabels = incomeLabels.slice(-5);
    const recentIncomeData = incomeData.slice(-5);

    // Create income chart
    new Chart(ctxIncome, {
        type: 'bar',
        data: {
            labels: recentIncomeLabels,
            datasets: [{
                label: 'Income by Category',
                data: recentIncomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Prepare data for expense chart
    const expenseCategories = Expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    // Get labels and data for expense chart
    const expenseLabels = Object.keys(expenseCategories);
    const expenseData = Object.values(expenseCategories);

    // Show only the last 5 expense categories
    const recentExpenseLabels = expenseLabels.slice(-5);
    const recentExpenseData = expenseData.slice(-5);

    // Create expense chart
    new Chart(ctxExpense, {
        type: 'bar',
        data: {
            labels: recentExpenseLabels,
            datasets: [{
                label: 'Expenses by Category',
                data: recentExpenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Function to generate the PDF report
function generateReport() {
    // Check if OneUser is signed in
    let OneUser = JSON.parse(localStorage.getItem("OneUser")) || null;
    if (!OneUser) {
        alert("User is not logged in. Redirecting to login page...");
        window.location.href = "login.html"; // Redirect to login page if not signed in
        return;
    }

    // Retrieve income and expense data
    let expIncData = JSON.parse(localStorage.getItem("OneUser")) || { Income: [], Expenses: [] };
    let Income = expIncData.Income || [];
    let Expenses = expIncData.Expenses || [];

    // Calculate totals
    let totalIncome = Income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let totalExpenses = Expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    let balance = totalIncome - totalExpenses;

    // Get user's basic details
    let userDetails = `
        Name: ${OneUser.FirstName + ' ' + OneUser.LastName}\n
        Email: ${OneUser.Email}\n
        Total Income: ${totalIncome.toFixed(2)} Rs\n
        Total Expenses: ${totalExpenses.toFixed(2)} Rs\n
        Balance: ${balance.toFixed(2)} Rs
    `;

    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
    });

    // Add basic details
    doc.setFontSize(18);
    doc.text("User Report", 40, 40);
    doc.setFontSize(12);
    doc.text(userDetails, 40, 80);

    // Add space before the Income Table
    let startX = 40;
    let startY = 260; // Starting Y position for Income Table
    let spacing = 10; // Space between user info and table

    // Add Income Table
    doc.text("Income Details", startX, startY - spacing);
    doc.autoTable({
        startY: startY,
        head: [['No', 'Category', 'Amount (Rs)']],
        body: Income.map((income, index) => [index + 1, income.category, income.amount]),
        theme: 'grid'
    });

    // Create Expenses Table
    startY = doc.previousAutoTable.finalY + 30;
    doc.text("Expenses Details", startX, startY - 20);
    doc.autoTable({
        startY: startY,
        head: [['No', 'Category', 'Amount (Rs)']],
        body: Expenses.map((expense, index) => [index + 1, expense.category, expense.amount]),
        theme: 'grid'
    });

    // Download PDF
    doc.save('User_Report.pdf');
}

// Add event listener to the button
document.getElementById("generateReport").addEventListener("click", generateReport);

// For toggle Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('#right');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
});
