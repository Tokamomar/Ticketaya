document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get("matchId");
    const matchDetailsContainer = document.getElementById("match-details-container");
    const messageDiv = document.getElementById("message");
    const paymentPopup = document.getElementById("payment-popup");
    const popupTotalPriceElement = document.getElementById("popup-total-price");
    const cashButton = document.getElementById("cashButton");
    const creditCardButton = document.getElementById("creditCardButton");
    const cancelButton = document.getElementById("cancel-btn");
    const overlay = document.getElementById("overlay");
    const successMessage = document.getElementById("successMessage");

    let quantity = 1;
    let ticketPrice = 0;

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
            ticketPrice = parseFloat(data.ticket_price).toFixed(2);

            const matchHTML = `
                <h2>Match Details</h2>
                <p><strong>Match Name:</strong> <span id="match-name">${data.name}</span></p>
                <p><strong>Teams:</strong> <span id="teams">${data.team1} vs. ${data.team2}</span></p>
                <p><strong>Date:</strong> <span id="match-date">${data.date}</span></p>
                <p><strong>Stadium:</strong> <span id="match-stadium">${data.stadium}</span></p>
                <p><strong>Price per Ticket:</strong> $<span id="ticket-price">${ticketPrice}</span></p>
                <p><strong>Available Tickets:</strong> <span id="match-tickets">${data.no_tickets}</span></p>
                <p><strong>Details:</strong> <span id="match-details">${data.description}</span></p>
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
                quantity = parseInt(ticketQuantityInput.value);
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

    function showPaymentMethodModal(quantity, ticketPrice) {
        const totalPrice = (quantity * parseFloat(ticketPrice)).toFixed(2);
        popupTotalPriceElement.textContent = `Total Price: $${totalPrice}`;
        paymentPopup.style.display = "flex";
    }

    // Cash Button
    cashButton.addEventListener("click", () => {
        const accessToken = localStorage.getItem('accessToken');

        paymentPopup.style.display = "none";
        overlay.style.display = "block";
        successMessage.style.display = "block";

        setTimeout(() => {
            overlay.style.display = "none";
            successMessage.style.display = "none";
        }, 5000);

        // Proceed with the fetch request to the backend
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
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                console.error("Reservation issue:", data);
            }
        })
        .catch(error => {
            console.error("Reservation error:", error);
        });
    });

    // Credit Card Button
    creditCardButton.addEventListener("click", () => {
        const accessToken = localStorage.getItem('accessToken');

        const totalPrice = (quantity * ticketPrice).toFixed(2); 
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
        .then((response) => response.json())
        .then((data) => {
            if (data.reservation) {
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

    // Cancel button
    cancelButton.addEventListener("click", () => {
        paymentPopup.style.display = "none";
    });
});

// Back button
backButton.addEventListener("click", () => {
    window.location.href = "../index/main_page.html"; 
});
