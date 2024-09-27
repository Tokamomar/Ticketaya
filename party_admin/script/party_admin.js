let matchesData = []; 

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
    const matchList = document.getElementById('matchList');
    matchList.innerHTML = '';
    matches.forEach(match => {
        const matchDate = formatDate(match.datetime);
        const matchTime = formatTime(match.datetime);

        matchList.innerHTML += `
            <div class="admin-match">
                <div class="admin-match-info">
                    <h2>${match.name}</h2> <!-- Match name as heading -->
                    
                    <div class="match-details">
                        <span>${match.performer} 
                    </div>

                    <div class="match-details">
                        <img class="stadium-icon" src="../images/location.jpg" alt="">
                        <span>${match.location}</span> <!-- Stadium -->
                    </div>

                    <div class="match-details">
                        <span>${matchDate} | ${matchTime}</span> <!-- Date and Time -->
                    </div>

                    <div class="match-details">
                        <span>Tickets: ${match.number_of_tickets}</span> <!-- Number of tickets -->
                    </div>

                    <div class="match-details">
                        <span>Price: $${Math.floor(match.price)}</span> <!-- Price without decimal -->
                    </div>
                </div>

                <div class="admin-match-actions">
                    <button class="update-btn" onclick="editMatch(${match.id})">Update</button>
                    <button class="delete-btn" onclick="deleteMatch(${match.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

// Function to fetch all matches
function fetchMatches() {
    const token = localStorage.getItem('accessToken');
    fetch('http://127.0.0.1:8000/parties', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
       // alert('You are not logged in. We will redirect you to the login page.');
        setTimeout(() => {
           // window.location.href = '../../Registration/index/login.html'; 
        }, 2000);
    });
}

window.editMatch = function(matchId) {
    window.location.href = `../index/edit_party.html?editParty=${matchId}`;
};

// Function to delete a match
window.deleteMatch = function(matchId) {
    const token = localStorage.getItem('accessToken'); 
    const confirmation = confirm("Are you sure you want to delete this match?");
    if (confirmation) {
        matchesData = matchesData.filter(match => match.id !== matchId);
        displayMatches(matchesData); 

        fetch(`http://127.0.0.1:8000/parties/${matchId}/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete match');
            }
            alert('Match deleted successfully.');
        })
        .catch(error => {
            console.error('Error deleting match:', error);
            alert('Failed to delete the match. Refreshing data.');
            
            fetchMatches(); 
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    fetchMatches(); 

    // Search matches by name
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMatches = matchesData.filter(match => match.name.toLowerCase().includes(searchTerm)|| 
        match.location.toLowerCase().includes(searchTerm) || 
        match.performer.toLowerCase().includes(searchTerm));
        displayMatches(filteredMatches); 
    });
});
