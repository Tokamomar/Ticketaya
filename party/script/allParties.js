document.addEventListener('DOMContentLoaded', function() {
    const matchList = document.getElementById('matchList');
    const searchBar = document.getElementById('searchBar');
    let matchesData = []; 
    const accessToken = localStorage.getItem('accessToken');

    fetch('http://127.0.0.1:8000/parties', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` // replace with actual token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch parties');
        }
        return response.json();
    })
    .then(matches => {
        matchesData = matches; 
        displayMatches(matches);
    })
    .catch(error => {
        console.error('Error fetching parties:', error);
        alert('Unable to load parties. Please try again later.');
    });

    // Function to format date
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to format time
    function formatTime(timeString) {
        let [hours, minutes] = timeString.split(':');
        let period = 'AM';

        hours = parseInt(hours, 10);

        if (hours >= 12) {
            period = 'PM';
            if (hours > 12) hours -= 12;
        } else if (hours === 0) {
            hours = 12; 
        }

        return `${hours}:${minutes} ${period}`;
    }

    function displayMatches(matches) {
        matchList.innerHTML = ''; 
        matches.forEach(match => {
            const matchDate = formatDate(match.datetime);
            const matchTime = formatTime(match.datetime);

            matchList.innerHTML += `
                <div class="match-card">
                    <img src="../images/match-placeholder.png" alt="${match.name}"> <!-- Placeholder image -->
                    <div class="match-info">
                        <h3>${match.name}</h3> <!-- Match name as heading -->
                        <div class="match-details">
                            <span>${match.performer}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                        <img class="stadium-icon" src="../images/location.jpg" alt="Stadium Icon" style="width: 20px; height: auto; margin-right: 5px;">
                            <span>${match.location}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                            <span>${matchDate} | ${matchTime}</span> <!-- Date and Time -->
                        </div>
                        <div class="match-details">
                            <span>Tickets: ${match.number_of_tickets}</span> <!-- Number of tickets -->
                        </div>
                        <div class="match-details">
                            <span>Price: $${Math.round(match.price)}</span> <!-- Ticket price without decimals -->
                        </div>
                        <p>${match.description}</p> <!-- Match description -->
                    </div>
                    <div class="admin-match-actions">
                        <button class="book-ticket-btn" onclick="bookTicket(${match.id})">Book Now</button>
                    </div>
                </div>
            `;
        });
    }

    // Search matches
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMatches = matchesData.filter(match => 
            match.name.toLowerCase().includes(searchTerm)|| 
            match.location.toLowerCase().includes(searchTerm) || 
            match.performer.toLowerCase().includes(searchTerm)
        );
        displayMatches(filteredMatches);
    });
});

// Function to handle ticket booking
function bookTicket(matchId) {
    alert(`Booking ticket for match ID: ${matchId}`);
}
