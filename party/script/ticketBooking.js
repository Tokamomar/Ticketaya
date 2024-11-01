document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const partyId = urlParams.get("partyId");
  const matchDetailsContainer = document.getElementById(
    "match-details-container"
  );
  const messageDiv = document.getElementById("message");
  const accessToken = localStorage.getItem("accessToken");

  const cancelBtn = document.getElementById("cancel-btn");
  const creditCardBtn = document.getElementById("credit-card-btn");
  const cashBtn = document.getElementById("cash-btn");

  if (!partyId) {
    showMessage("Party ID not found in the URL.", "error");
    return;
  }

  // Fetch match details
  fetch(`http://127.0.0.1:8000/parties/${partyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const ticketPrice = parseFloat(data.price);
      const validTicketPrice = !isNaN(ticketPrice)
        ? ticketPrice.toFixed(2)
        : "0.00";


        const cairoTime = new Date(data.datetime);

    // Subtract 3 hours from the event date
    cairoTime.setHours(cairoTime.getHours() - 3);

    // Format the date and time without timezone info
    const formattedCairoTime = cairoTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long", // Full month name like "January"
      day: "numeric", // Numeric day like "29"
      hour: "numeric", // Hour like "1" or "13"
      minute: "numeric", // Minute like "19"
      second: "numeric", // Optional, include if you want seconds
      hour12: true, // This option makes it 12-hour format with AM/PM
    });

      const matchHTML = `
                <p><strong>Party Name:</strong> <span id="match-name">${
                  data.name
                }</span></p>
                <p><strong>Party Performer:</strong> <span>${
                  data.performer
                }</span></p>
                <p><strong>Date:</strong> <span id="match-date">${
                  formattedCairoTime
                }</span></p>
                <p><strong>Location:</strong> <span id="match-stadium">${
                  data.location
                }</span></p>
                <p><strong>Price per Ticket:</strong> $<span id="ticket-price">${validTicketPrice}</span></p>
                <p><strong>No. of  Available Tickets:</strong> <span id="match-tickets">${
                  data.number_of_tickets
                }</span></p>
                <p><strong>Details:</strong> <span id="match-description">${
                  data.description || "No description available."
                }</span></p>
                <div class="ticket-selection">
                    <label for="ticket-quantity">Number of Tickets:</label>
                    <input type="number" id="ticket-quantity" min="1" value="1">
                    <p class="total-price">Total Price: $<span id="total-price">${validTicketPrice}</span></p>
                    <button id="proceed-btn">Proceed to Buy</button>
                    <button id="back-btn">Back to parties</button>
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
        const available = parseInt(data.number_of_tickets);
        console.log(quantity);

        if (quantity > available) {
          showMessage(
            `Sorry, only ${available} tickets are available.`,
            "error"
          );
          alert(`only ${available} tickets are available`)
        } else {
          showPaymentMethodDialog(quantity, ticketPrice);
        }
      });

      const backBtn = document.getElementById("back-btn");
      backBtn.addEventListener("click", () => {
        window.location.href = "../index/allParties.html";
      });
    })
    .catch((error) => {
      showMessage("Failed to load match details: " + error.message, "error");
    });

  function showMessage(message, type) {
    if (messageDiv) {
      messageDiv.textContent = message;
      if (type === "error") {
        messageDiv.style.color = "red";
      } else {
        messageDiv.style.color = "white"; // or any other contrasting color
      }
      messageDiv.style.display = "block";
      messageDiv.style.margin = "10px 0";
      messageDiv.style.backgroundColor = "blue";
    }
  }

  function showPaymentMethodDialog(quantity, ticketPrice) {
    const totalPrice = (quantity * ticketPrice).toFixed(2);

    paymentPopup.style.display = "block";
    const methods = document.getElementById("methods");
    methods.textContent = "Which method of payment do you prefer?";
    creditCardBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    cashBtn.style.display = "inline-block";

    cashBtn.addEventListener("click", () => {
      fetch(`http://127.0.0.1:8000/parties/bookticket/${partyId}/`, {
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
            alert("can not complete the reservation due to some issues!");
          }
          return response.json();
        })
        .then((data) => {
          cashBtn.style.display = "none";
          creditCardBtn.style.display = "none";
          methods.textContent = data.message;
        });
    });
    //todo ==========================    credite   =====================================================
    creditCardBtn.addEventListener("click", () => {
      fetch(`http://127.0.0.1:8000/parties/bookticket/${partyId}/`, {
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
            alert("can not complete the reservation due to some issues!");
          }
          return response.json();
        })
        .then((data) => {
          window.location.href = `payment.html?total=${totalPrice}&pk=${data.reservation.pk}&partyId=${partyId}`
        });
    });
    //todo ==========================    credite   =====================================================


  }

  const paymentPopup = document.getElementById("payment-popup");

  cancelBtn.addEventListener("click", () => {
    paymentPopup.style.display = "none";
    window.location.reload();
  });
});
