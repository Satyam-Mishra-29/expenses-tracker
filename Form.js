// Ensure the DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve current user from localStorage
    let data = JSON.parse(localStorage.getItem("data")) || {};
    let OneUser = JSON.parse(localStorage.getItem("OneUser")) || null;

    // Check if user is logged in
    if (!OneUser) {
        alert("User is not logged in. Redirecting to login page...");
        // Optionally redirect to the login page if the user isn't logged in
        window.location.href = "login.html"; // Replace with your login page URL
    } else {
        // Initialize arrays based on the current user's data
        let Income = OneUser.Income || [];
        let Expenses = OneUser.Expenses || [];
        data.Income = data.Income || [];
        data.Expenses = data.Expenses || [];

        // Form submission handler
        const transactionForm = document.getElementById("transactionForm");
        if (transactionForm) {
            transactionForm.addEventListener("submit", (e) => {
                e.preventDefault(); // Prevent form submission

                // Retrieve form values
                let type = document.getElementById("type").value;
                let amount = parseFloat(document.getElementById("amount").value);
                let category = document.getElementById("category").value;
                let description = document.getElementById("description").value;

                // Validate that amount is a valid number
                if (isNaN(amount) || amount <= 0) {
                    alert("Please enter a valid amount.");
                    return;
                }

                // Create transaction object
                let transaction = {
                    type: type,
                    amount: amount,
                    category: category,
                    description: description
                };

                // Update ExpInc JSON variable in both OneUser and data
                if (type === "income") {
                    Income.push(transaction);
                    OneUser.Income = Income;
                    data.Income.push(transaction); // Ensure data object is also updated
                } else if (type === "expense") {
                    Expenses.push(transaction);
                    OneUser.Expenses = Expenses;
                    data.Expenses.push(transaction); // Ensure data object is also updated
                }

                // Save the updated OneUser and data objects back to localStorage
                localStorage.setItem("OneUser", JSON.stringify(OneUser));
                localStorage.setItem("data", JSON.stringify(data));

                // Clear the form after submission
                e.target.reset();

                // Notify the user of the successful addition
                alert('Transaction added successfully!');
            });
        }

        // Add event listener for the dashboard button
        let GotoDashboard = document.getElementById("goToDashboard");
        if (GotoDashboard) {
            GotoDashboard.addEventListener("click", (e) => {
                window.location.href = "./DashBoard.html";
            });
        }
    }
});
