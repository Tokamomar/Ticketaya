const accessToken = localStorage.getItem('accessToken');

fetch('http://127.0.0.1:8000/parties', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        alert("Something went wrong");
    }
})
.then(data => {
    console.log(data);

    function calculateCountdown(eventDate) {
        const now = new Date().getTime();
        const distance = new Date(eventDate).getTime() - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            return "Event Over!";
        }

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Function to dynamically create event cards and append them
    function renderEventCards() {
        const cardsContainer = document.getElementById('cards');

        data.forEach(event => {
            // Create a card element
            const card = document.createElement('div');
            card.classList.add('card');

            // Create the inner HTML with dynamic content
            card.innerHTML = `
    <div class="image_holder">
        <img src="../images/green_ticket.png" class="ticket">
        <div class="ticket_content">
            <div class="count_down" id="countDown-${event.id}">${calculateCountdown(event.datetime)}</div>
            <div class="header">Join The Fun!</div>
            <h3 class="name">${event.name}</h3>
            <div class="performer_tag">
                <p class="performer">Performer : ${event.performer}</p>
                <span class="tag">#music</span>
            </div>
            <p class="location">Location: ${event.location}</p>
            <p class="date">On ${new Date(event.datetime).toLocaleDateString()} at ${new Date(event.datetime).toLocaleTimeString()}</p>
            <p class="price">${event.price} LE</p>
            <p class="details"><a href="#">See details</a></p>
        </div>
    </div>
`;

            // Append the card to the container
            cardsContainer.appendChild(card);
        });
    }

    // Function to update the countdown every second
    function updateCountdown() {
        data.forEach(event => {
            const countdownElement = document.getElementById(`countDown-${event.id}`);
            if (countdownElement) {
                countdownElement.innerHTML = calculateCountdown(event.datetime);
            }
        });
    }

    // Initial render of cards
    renderEventCards();

    // Update the countdown every second
    setInterval(updateCountdown, 1000);
})
.catch(error => {
    console.error('Error:', error);
});
