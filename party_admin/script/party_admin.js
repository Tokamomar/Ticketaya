const accessToken = localStorage.getItem('accessToken')
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
     // Function to dynamically create event cards and append them
     function renderEventCards() {
        const cardsContainer = document.getElementById('parties');

        data.forEach(event => {
            // Create a card element
            const card = document.createElement('div');
            card.classList.add('card');

            // Create the inner HTML with dynamic content
            card.innerHTML = `
                <div class="image_holder">
                    <div class="ticket_content">
                        <div class="count_down" id="countDown-${event.id}">${(event.datetime)}</div>
                        <div class="header">Join The Fun!</div>
                        <h3 class="name">${event.name}</h3>
                        <div class="performer_tag">
                            <p class="performer">Performer : ${event.performer}</p>
                            <span class="tag">#music</span>
                        </div>
                        <p class="location">Location: ${event.location}</p>
                        <p class="date">On ${new Date(event.datetime).toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' })} at ${new Date(event.datetime).toLocaleTimeString('en-US')}</p>
                        <p class="price">${event.price} LE</p>
                        <p class="details"><a href="#" class="seeDetails" data-event-id="${event.id}">See details</a></p>
                        <button type="button" class="deleteBtn" deletedParty="${event.id}">delete</button>
                        <button type="button" class="editBtn" editParty="${event.id}">edit</button>
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
                const partyId = this.getAttribute('partyId');

                // Store the selected event in local storage
                localStorage.setItem('partyId', JSON.stringify(partyId));
            });
        });

        // Add event listeners to all "delete" buttons after rendering the cards
        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default button behavior
                const deletedParty = this.getAttribute('deletedParty');

                console.log(deletedParty);
                // Show confirmation (you can use a proper confirmation dialog)
                if (confirm("Are you sure you want to delete this party?")) {
                    fetch(`http://127.0.0.1:8000/parties/${deletedParty}/delete`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        if (response.status == 204) {
                            console.log("Party deleted successfully");
                            // Optionally, remove the card from the UI after deletion
                            this.closest('.card').remove();
                        } else {
                            alert("Cannot delete this party");
                        }
                    });
                }
            });
        });

        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default anchor behavior
                const editParty = this.getAttribute('editParty');

                // Store the selected event in local storage
                localStorage.setItem('editParty', JSON.stringify(editParty));
                console.log(typeof(editParty))
                window.location.href = "../index/edit_party.html"
            });
        });
    }
    
    renderEventCards();
})



//! ==============================    search ===================


document.getElementById('search').addEventListener('input', function() {
    let query = this.value.trim();  // Get the input value and trim whitespace
    

    if (query.length >= 1) {  // Start searching when the query has more than 2 characters
        const parties = document.getElementById('parties');
        parties.innerHTML = ''
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
        }).then(data => {
            console.log(data);
             // Function to dynamically create event cards and append them
             function renderEventCards() {
                const cardsContainer = document.getElementById('parties');
        
                data.forEach(event => {
                    // Create a card element
                    const card = document.createElement('div');
                    card.classList.add('card');
        
                    // Create the inner HTML with dynamic content
                    card.innerHTML = `
                        <div class="image_holder">
                            <div class="ticket_content">
                                <div class="count_down" id="countDown-${event.id}">${(event.datetime)}</div>
                                <div class="header">Join The Fun!</div>
                                <h3 class="name">${event.name}</h3>
                                <div class="performer_tag">
                                    <p class="performer">Performer : ${event.performer}</p>
                                    <span class="tag">#music</span>
                                </div>
                                <p class="location">Location: ${event.location}</p>
                                <p class="date">On ${new Date(event.datetime).toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' })} at ${new Date(event.datetime).toLocaleTimeString('en-US')}</p>
                                <p class="price">${event.price} LE</p>
                                <p class="details"><a href="#" class="seeDetails" data-event-id="${event.id}">See details</a></p>
                                <button type="button" class="deleteBtn" deletedParty="${event.id}">delete</button>
                                <button type="button" class="editBtn" editParty="${event.id}">edit</button>
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
                        const partyId = this.getAttribute('partyId');
        
                        // Store the selected event in local storage
                        localStorage.setItem('partyId', JSON.stringify(partyId));
                    });
                });
        
                // Add event listeners to all "delete" buttons after rendering the cards
                document.querySelectorAll('.deleteBtn').forEach(btn => {
                    btn.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default button behavior
                        const deletedParty = this.getAttribute('deletedParty');
        
                        console.log(deletedParty);
                        // Show confirmation (you can use a proper confirmation dialog)
                        if (confirm("Are you sure you want to delete this party?")) {
                            fetch(`http://127.0.0.1:8000/parties/${deletedParty}/delete`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                }
                            }).then(response => {
                                if (response.status == 204) {
                                    console.log("Party deleted successfully");
                                    // Optionally, remove the card from the UI after deletion
                                    this.closest('.card').remove();
                                } else {
                                    alert("Cannot delete this party");
                                }
                            });
                        }
                    });
                });
        
                document.querySelectorAll('.editBtn').forEach(btn => {
                    btn.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default anchor behavior
                        const editParty = this.getAttribute('editParty');
        
                        // Store the selected event in local storage
                        localStorage.setItem('editParty', JSON.stringify(editParty));
                        console.log(typeof(editParty))
                        window.location.href = "../index/edit_party.html"
                    });
                });
            }
            
            renderEventCards();
        })


    } else {
        document.getElementById('search_results').innerHTML = '';  // Clear results if the input is too short
    }
});