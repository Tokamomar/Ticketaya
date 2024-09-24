document.addEventListener("DOMContentLoaded", () => {
    //const availableCount = 100; // Example number of available tickets
    const ticketQuantityInput = document.getElementById("ticket-quantity");
    const totalPriceElement = document.getElementById("total-price");
    const proceedButton = document.getElementById("proceed-btn");
    const availableCountDisplay = document.getElementById("available-count");
    const availableTicketsDiv = document.getElementById("available-tickets");

    // Update the displayed available tickets count
    availableCountDisplay.textContent = availableCount;

    // Update total price based on ticket quantity
    ticketQuantityInput.addEventListener("input", () => {
        const quantity = parseInt(ticketQuantityInput.value) || 0;
        const totalPrice = quantity * 50; // Assuming ticket price is $50
        totalPriceElement.textContent = totalPrice;

        // Check if selected quantity exceeds available tickets and alert if so
        if (quantity > availableCount) {
            alert(`You cannot book more than ${availableCount} tickets.`);
            ticketQuantityInput.value = availableCount; // Reset to max available
            totalPriceElement.textContent = availableCount * 50; // Update price to match max available
        }
    });

    // Proceed button click event
    proceedButton.addEventListener("click", () => {
        const quantity = parseInt(ticketQuantityInput.value) || 0;

        // Check if selected quantity exceeds available tickets
        if (quantity > availableCount) {
            alert(`You cannot book more than ${availableCount} tickets.`);
        } else {
            alert("Proceeding to payment...");
            window.location.href = 'payment.html'; 
        }
    });
});
