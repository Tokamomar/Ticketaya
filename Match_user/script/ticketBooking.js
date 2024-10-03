document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get("matchId");
    const matchDetailsContainer = document.getElementById("match-details-container");
    const messageDiv = document.getElementById("message");
    const paymentPopup = document.getElementById("payment-popup");
    const totalPriceElement = document.getElementById("total-price"); 
    const popupTotalPriceElement = document.getElementById("popup-total-price"); 
    const cashButton = document.getElementById("cashButton");
    const creditCardButton = document.getElementById("creditCardButton");
    const cancelButton = document.getElementById("cancel-btn");
    
    let quantity = 1; 

    if (!matchId) {
        showMessage("Match ID not found in the URL.", "error");
        return;
    }

    // Fetch match details
    fetch(`http://127.0.0.1:8000/match/retriveonematch/${matchId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const ticketPrice = parseFloat(data.ticket_price).toFixed(2);

            const matchHTML = `
                <h2>Match Details</h2>
                <p><strong>Match Name:</strong> <span id="match-name">${data.name}</span></p>
                <p><strong>Date:</strong> <span id="match-date">${data.date}</span></p>
                <p><strong>Stadium:</strong> <span id="match-stadium">${data.stadium}</span></p>
                <p><strong>Price per Ticket:</strong> $<span id="ticket-price">${ticketPrice}</span></p>
                <p><strong>Available Tickets:</strong> <span id="match-tickets">${data.no_tickets}</span></p>
                <div class="ticket-selection">
                    <label for="ticket-quantity">Number of Tickets:</label>
                    <input type="number" id="ticket-quantity" min="1" value="1">
                    <p class="total-price">Total Price: $<span id="total-price">${ticketPrice}</span></p>
                    <button id="proceed-btn">Proceed to Buy</button>
                </div>
            `;

            matchDetailsContainer.innerHTML = matchHTML;

            const ticketQuantityInput = document.getElementById("ticket-quantity");
            const totalPriceElement = document.getElementById("total-price");

            ticketQuantityInput.addEventListener("input", () => {
                quantity = parseInt(ticketQuantityInput.value); // Update quantity based on user input
                // Total price updated according to the number of tickets
                totalPriceElement.textContent = (quantity * ticketPrice).toFixed(2);
            });

            const proceedButton = document.getElementById("proceed-btn");
            proceedButton.addEventListener("click", () => {
                const available = parseInt(data.no_tickets);
                if (quantity > available) {
                    alert(`Sorry, only ${available} tickets are available.`);
                } else {
                    showPaymentMethodModal(quantity, ticketPrice);
                }
            });
        })
        .catch(error => {
            showMessage("Failed to load match details: " + error.message, "error");
        });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.style.color = type === "error" ? "red" : "green";
        messageDiv.style.display = "block";
    }

    // Show payment method modal function
    function showPaymentMethodModal(quantity, ticketPrice) {
        const totalPrice = (quantity * parseFloat(ticketPrice)).toFixed(2); 
        popupTotalPriceElement.textContent = `Total Price: $${totalPrice}`; 
        paymentPopup.style.display = "flex"; 
    }

    // Cash Button
    cashButton.addEventListener("click", () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch(`http://127.0.0.1:8000/reservation/bookticket/${matchId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                tickets_reserved: quantity,
                pay_method: "offline",
            }),
        })
        .then((response) => {
            if (!response.ok) {
                console.error("Response Error:", response);
                alert("Cannot complete the reservation due to some issues!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response Data:", data);
            if (data.success) {
                messageDiv.innerHTML = `
                    <div id="successMessage">
                        <i class="fa-solid fa-circle-check" style="color: #5a875b; font-size: 24px;"></i>
                        <p>Successful Reservation! Please check your email for confirmation.</p>
                    </div>
                `;
                paymentPopup.style.display = "none"; 
            } else {
                alert("Reservation failed. Please try again.");
            }
        })
        .catch(error => {
            console.error("Payment error:", error);
            alert("Payment failed: " + error.message);
        });
    });

    // Credit Card Button
    creditCardButton.addEventListener("click", () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch(`http://127.0.0.1:8000/reservation/bookticket/${matchId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                tickets_reserved: quantity,
                pay_method: "online",
            }),
        })
        .then((response) => {
            if (!response.ok) {
                alert("Cannot complete the reservation due to some issues!");
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (data.reservation) {
                // Redirect to payment page
                const totalPrice = (quantity * parseFloat(data.ticket_price)).toFixed(2);
                window.location.href = `payment.html?total=${totalPrice}&tickets=${quantity}&pk=${data.reservation.pk}&matchId=${matchId}`;
            } else {
                alert("Reservation not found. Please try again.");
            }
        })
        .catch(error => {
            console.error("Payment error:", error);
            alert("Payment failed: " + error.message);
        });
    });

    // Cancel Button
    cancelButton.addEventListener("click", () => {
        paymentPopup.style.display = "none";
    });
});
