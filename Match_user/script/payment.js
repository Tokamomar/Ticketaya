document.addEventListener("DOMContentLoaded", () => {
    const totalAmountElement = document.getElementById("total-amount");
    const ticketQuantityElement = document.getElementById("ticket-quantity");
    const creditCardInput = document.getElementById("credit-card");
    const payNowButton = document.getElementById("pay-now-btn");
    const paymentMessageDiv = document.getElementById("payment-message");
    const successMessageDiv = document.getElementById("successMessage");
    const overlay = document.getElementById("overlay");

    // Extract parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let totalAmount = urlParams.get("total");
    let ticketQuantity = urlParams.get("tickets");
    const pk = urlParams.get("pk");
    const matchId = urlParams.get("matchId");

    totalAmount = isNaN(parseFloat(totalAmount)) ? 0 : parseFloat(totalAmount).toFixed(2);
    ticketQuantity = isNaN(parseInt(ticketQuantity)) ? 0 : parseInt(ticketQuantity);

    totalAmountElement.textContent = totalAmount;
    ticketQuantityElement.textContent = ticketQuantity;

    const accessToken = localStorage.getItem('accessToken'); 

    // Payment button 
    payNowButton.addEventListener("click", () => {
        const creditCardNumber = creditCardInput.value;

        // Valid credit card input
        if (creditCardNumber === "") {
            showPaymentMessage("Please enter your credit card number.", "error");
            return;
        }
    
        if (!/^\d{16}$/.test(creditCardNumber)) {
            showPaymentMessage("Payment failed: Invalid credit card number.", "error");
            return;
        }

        // Send payment request
        fetch(`http://127.0.0.1:8000/reservation/matchpayment/${pk}/?matchId=${matchId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                visa_card: creditCardNumber
            })
        })
        .then(response => response.json()) 
        .then(data => {
            console.log(data); 
            if (data && data.success) {
                showPaymentMessage('Payment successful! Thank you for your purchase.', 'success');
            }

            overlay.style.display = "block";
            successMessageDiv.style.display = "block"; 

            setTimeout(() => {
                overlay.style.display = "none";
                successMessageDiv.style.display = "none";
                window.location.href = "main_page.html"; 
            }, 3000);
        })
        .catch(error => {
            console.error("Payment error:", error);
            showPaymentMessage('Payment processing, please wait...', 'info');
        });
    });

    function showPaymentMessage(message, type) {
        paymentMessageDiv.textContent = message;
        paymentMessageDiv.style.color = type === "error" ? "red" : type === "success" ? "green" : "orange";
        paymentMessageDiv.style.display = "block"; 
    }
});
