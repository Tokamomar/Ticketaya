document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get("matchId");
    const matchDetailsContainer = document.getElementById("match-details-container");
    const messageDiv = document.getElementById("message");

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
            const ticketPrice = parseFloat(data.ticket_price);
            const validTicketPrice = !isNaN(ticketPrice) ? ticketPrice.toFixed(2) : "0.00"; 

            const matchHTML = `
                <p><strong>Match Name:</strong> <span id="match-name">${data.name}</span></p>
                <p><strong>Date:</strong> <span id="match-date">${data.date}</span></p>
                <p><strong>Stadium:</strong> <span id="match-stadium">${data.stadium}</span></p>
                <p><strong>Price per Ticket:</strong> $<span id="ticket-price">${validTicketPrice}</span></p>
                <p><strong>No. of  Available Tickets:</strong> <span id="match-tickets">${data.no_tickets}</span></p>
                <p><strong>Details:</strong> <span id="match-description">${data.description || "No description available."}</span></p>
                <div class="ticket-selection">
                    <label for="ticket-quantity">Number of Tickets:</label>
                    <input type="number" id="ticket-quantity" min="1" value="1">
                    <p class="total-price">Total Price: $<span id="total-price">${validTicketPrice}</span></p>
                    <button id="proceed-btn">Proceed to Buy</button>
                </div>
            `;

            matchDetailsContainer.innerHTML = matchHTML;

            const ticketQuantityInput = document.getElementById("ticket-quantity");
            const totalPriceElement = document.getElementById("total-price");

            ticketQuantityInput.addEventListener("input", () => {
                const quantity = parseInt(ticketQuantityInput.value);
                totalPriceElement.textContent = (quantity * ticketPrice).toFixed(2);
            });

            const proceedButton = document.getElementById("proceed-btn");
            proceedButton.addEventListener("click", () => {
                const quantity = parseInt(ticketQuantityInput.value);
                const available = parseInt(data.no_tickets); 

                if (quantity > available) {
                    showMessage(`Sorry, only ${available} tickets are available.`, "error");
                } else {
                    showPaymentMethodDialog(quantity, ticketPrice);
                }
            });
        })
        .catch(error => {
            showMessage("Failed to load match details: " + error.message, "error");
        });

    function showMessage(message, type) {
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.color = type === "error" ? "red" : "green"; //error message
            messageDiv.style.display = "block";
            messageDiv.style.margin = "10px 0";
        }
    }

    function showPaymentMethodDialog(quantity, ticketPrice) {
        const totalPrice = (quantity * ticketPrice).toFixed(2);
        const paymentMethod = prompt(`Choose a payment method:\n1. Cash\n2. Credit Card\nTotal Price: $${totalPrice}`);
        
        if (paymentMethod === "1") {
            showMessage("Cash payment selected. Please proceed to the venue.", "success");
        } else if (paymentMethod === "2") {
            // Redirect to payment.html with the total amount in the query string
            window.location.href = `payment.html?total=${totalPrice}`;
        } else {
            showMessage("Invalid selection. Please try again.", "error");
        }
    }
});
