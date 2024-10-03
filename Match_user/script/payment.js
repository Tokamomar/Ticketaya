document.addEventListener("DOMContentLoaded", () => {
    const totalAmountElement = document.getElementById("total-amount");
    const ticketQuantityElement = document.getElementById("ticket-quantity");
    const creditCardInput = document.getElementById("credit-card");
    const payNowButton = document.getElementById("pay-now-btn");
    const paymentMessageDiv = document.getElementById("payment-message");
    const successMessageDiv = document.getElementById("successMessage");
    const overlay = document.getElementById("overlay");
    const urlParams = new URLSearchParams(window.location.search);
    const totalAmount = urlParams.get("total");
    const ticketQuantity = urlParams.get("tickets");
    const pk = urlParams.get("pk");
    const matchId = urlParams.get("matchId");

    totalAmountElement.textContent = totalAmount; 
    ticketQuantityElement.textContent = ticketQuantity;

    const accessToken = localStorage.getItem('accessToken'); 

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

        // Payment request 
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
        .then(response => {
            if (!response.ok) {
                showPaymentMessage('Failed to complete payment method!', 'error');
                return; 
            }
            return response.json(); 
        })
        .then(data => {
            if (data.success) { 
                processPayment(creditCardNumber, totalAmount); 
            } else {
                showPaymentMessage("Payment failed: " + data.message, "error");
            }
        })
        .catch(error => {
            console.error("Payment error:", error);
            showPaymentMessage("Payment failed: " + error.message, "error");
        });
    });

    function showPaymentMessage(message, type) {
        paymentMessageDiv.textContent = message;
        paymentMessageDiv.style.color = type === "error" ? "red" : "green";
    }
    
    //Successful payment 
    function processPayment(creditCardNumber, amount) {
        overlay.style.display = "block"; 
        successMessageDiv.style.display = "block"; 

        setTimeout(() => {
            overlay.style.display = "none"; 
            successMessageDiv.style.display = "none"; 
            window.location.href = "main_page.html"; 
        }, 3000);
    }
});
