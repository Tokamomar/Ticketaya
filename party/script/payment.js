document.addEventListener("DOMContentLoaded", () => {
    const totalAmountElement = document.getElementById("total-amount");
    const creditCardInput = document.getElementById("credit-card");
    const payNowButton = document.getElementById("pay-now-btn");
    const paymentMessageDiv = document.getElementById("payment-message");
    const accessToken = localStorage.getItem('accessToken')
    const back = document.getElementById('back')

    back.addEventListener('click' , ()=>{
        window.location.href = 'allParties.html'
    })

    // Get total amount from URL
    const urlParams = new URLSearchParams(window.location.search);
    const totalAmount = urlParams.get("total");
    const pk = urlParams.get("pk");
    const partyId = urlParams.get("partyId");
    totalAmountElement.textContent = totalAmount;

    payNowButton.addEventListener("click", () => {
        const creditCardNumber = creditCardInput.value;

        if (!/^\d{16}$/.test(creditCardNumber)) {
            showPaymentMessage("Payment failed: Invalid credit card number.", "error");
            return;
        }



        fetch(`http://127.0.0.1:8000/parties/partypayment/${pk}/?partyId=${partyId}/` , {
            method : "POST" ,
            headers :{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                visa_card : creditCardNumber
              })
        }).then(response=>{
            if(!response.ok){
                alert('failed to complete payment method!')
            }
            else{
                processPayment(creditCardNumber, totalAmount);
            }
        })


        // Simulate payment processing
        // processPayment(creditCardNumber, totalAmount);
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
