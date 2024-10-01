document.addEventListener("DOMContentLoaded", () => {
    const totalAmountElement = document.getElementById("total-amount");
    const creditCardInput = document.getElementById("credit-card");
    const payNowButton = document.getElementById("pay-now-btn");
    const paymentMessageDiv = document.getElementById("payment-message");

    // Get total amount from URL
    const urlParams = new URLSearchParams(window.location.search);
    const totalAmount = urlParams.get("total");
    totalAmountElement.textContent = totalAmount;
console.log(totalAmount)
    payNowButton.addEventListener("click", () => {
        const creditCardNumber = creditCardInput.value;

        if (!/^\d{16}$/.test(creditCardNumber)) {
            showPaymentMessage("Payment failed: Invalid credit card number.", "error");
            return;
        }

        // Simulate payment processing
        processPayment(creditCardNumber, totalAmount);
    });

    function showPaymentMessage(message, type) {
        paymentMessageDiv.textContent = message;
        paymentMessageDiv.style.color = type === "error" ? "red" : "green";
        paymentMessageDiv.style.display = "block";
    }

    function processPayment(creditCardNumber, amount) {
        // Simulate payment success
        showPaymentMessage("Payment successful! Thank you for your purchase.", "success");
    }
});
