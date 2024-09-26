
const accessToken = localStorage.getItem('accessToken');

let allParties = [] ;

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


            const partyTime = new Date(event.datetime).toLocaleString('en-US', {
                timeZone: 'Africa/Cairo',
                year: 'numeric',
                month: 'long', // Full month name like "January"
                day: 'numeric', // Numeric day like "29"
                hour: 'numeric', // Hour like "1" or "13"
                minute: 'numeric', // Minute like "19"
                second: 'numeric', // Second like "00"
                hour12: true // This option makes it 12-hour format with AM/PM
            });


            // Create the inner HTML with dynamic content
            card.innerHTML = `
                <div class="image_holder">
                    
                    <div class="ticket_content">
                        <div class="count_down" id="countDown-${event.id}">${calculateCountdown(event.datetime)}</div>
                        <h3 class="name">${event.name}</h3>
                        <div class="performer_tag">
                            <p class="performer">Performer : ${event.performer}</p>
                        </div>
                        <p class="location">Location: ${event.location}</p>
                        <p class="date">On ${new Date(event.datetime).toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' })} at ${new Date(event.datetime).toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo' })}</p>
                        <p class="date">On ${partyTime}</p>
                        <p class="price">${event.price} LE</p>
                        <p class="details"><a href="#" class="seeDetails" data-event-id="${event.id}">See details</a></p>
                    </div>
                </div>
            `;

            // Append the card to the container
            cardsContainer.appendChild(card);
        });

        // Add event listeners to all "See details" links after rendering the cards
        document.querySelectorAll('.seeDetails').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default anchor behavior
                const partyId = this.getAttribute('data-event-id');
                //const selectedEvent = data.find(e => e.id == eventId);

                // Store the selected event in local storage
                localStorage.setItem('partyId', JSON.stringify(partyId));

                // Redirect to the details page
                window.location.href = `../index/party_details.html?partyId=${partyId}`;
            });
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
    setInterval(updateCountdown, 1000);

})
.catch(error => {
    console.error('Error:', error);
});


//! ==============================    search ===================


document.getElementById('search').addEventListener('input', function() {
    let query = this.value.trim();  // Get the input value and trim whitespace

    if (query.length >= 1) {  // Start searching when the query has more than 2 characters
        fetch(`http://127.0.0.1:8000/parties/search?name=${encodeURIComponent(query)}` , {
            method : "GET" , 
            headers : {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        }).then(response=>{
            if(response.ok){
                return response.json()
            }else{
                alert("something wrong with the search")
            }
        }).then(data=>{
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
                cardsContainer.innerHTML = ''

        
                data.forEach(event => {
                    // Create a card element
                    const card = document.createElement('div');
                    card.classList.add('card');
        
        
                    const partyTime = new Date(event.datetime).toLocaleString('en-US', {
                        timeZone: 'Africa/Cairo',
                        year: 'numeric',
                        month: 'long', // Full month name like "January"
                        day: 'numeric', // Numeric day like "29"
                        hour: 'numeric', // Hour like "1" or "13"
                        minute: 'numeric', // Minute like "19"
                        second: 'numeric', // Second like "00"
                        hour12: true // This option makes it 12-hour format with AM/PM
                    });
        
        
                    // Create the inner HTML with dynamic content
                    card.innerHTML = `
                        <div class="image_holder">
                            
                            <div class="ticket_content">
                                <div class="count_down" id="countDown-${event.id}">${calculateCountdown(event.datetime)}</div>
                                <h3 class="name">${event.name}</h3>
                                <div class="performer_tag">
                                    <p class="performer">Performer : ${event.performer}</p>
                                </div>
                                <p class="location">Location: ${event.location}</p>
                                <p class="date">On ${new Date(event.datetime).toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' })} at ${new Date(event.datetime).toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo' })}</p>
                                <p class="date">On ${partyTime}</p>
                                <p class="price">${event.price} LE</p>
                                <p class="details"><a href="#" class="seeDetails" data-event-id="${event.id}">See details</a></p>
                            </div>
                        </div>
                    `;
        
                    // Append the card to the container
                    cardsContainer.appendChild(card);
                });
        
                // Add event listeners to all "See details" links after rendering the cards
                document.querySelectorAll('.seeDetails').forEach(link => {
                    link.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default anchor behavior
                        const partyId = this.getAttribute('data-event-id');
                        //const selectedEvent = data.find(e => e.id == eventId);
        
                        // Store the selected event in local storage
                        localStorage.setItem('partyId', JSON.stringify(partyId));
        
                        // Redirect to the details page
                        window.location.href = `../index/party_details.html?partyId=${partyId}`;
                    });
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
            setInterval(updateCountdown, 1000);
        })


    } else {
        document.getElementById('search_results').innerHTML = '';  // Clear results if the input is too short
    }
});