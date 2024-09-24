document.addEventListener('DOMContentLoaded', function() {
    const matchList = document.getElementById('matchList');
    const searchBar = document.getElementById('searchBar');
    let matchesData = []; 

    fetch('http://127.0.0.1:8000/match/retrive_all_match/', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        return response.json();
    })
    .then(matches => {
        matchesData = matches; 
        displayMatches(matches);
    })
    .catch(error => {
        console.error('Error fetching matches:', error);
        alert('Unable to load matches. Please try again later.');
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
            const matchDate = formatDate(match.date);
            const matchTime = formatTime(match.time);

            matchList.innerHTML += `
                <div class="match-card">
                    <img src="../images/match-placeholder.png" alt="${match.name} Match Image"> <!-- Placeholder image -->
                    <div class="match-info">
                        <h3>${match.name}</h3> <!-- Match name as heading -->
                        <div class="match-details">
                            <span>${match.team1} vs ${match.team2}</span> <!-- Teams -->
                        </div>
                        <div class="match-details">
                            <img class="stadium-icon" src="../images/stadium.png" alt="Stadium Icon" style="width: 20px; height: auto; margin-right: 5px;">
                            <span>${match.stadium}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                            <span>${matchDate} | ${matchTime}</span> <!-- Date and Time -->
                        </div>
                        <div class="match-details">
                            <span>Tickets: ${match.no_tickets}</span> <!-- Number of tickets -->
                        </div>
                        <div class="match-details">
                            <span>Price: $${Math.round(match.ticket_price)}</span> <!-- Ticket price without decimals -->
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
            match.name.toLowerCase().includes(searchTerm) || 
            match.team1.toLowerCase().includes(searchTerm) || 
            match.team2.toLowerCase().includes(searchTerm)
        );
        displayMatches(filteredMatches);
    });
});

// Function to handle ticket booking
function bookTicket(matchId) {
    alert(`Booking ticket for match ID: ${matchId}`);
}
