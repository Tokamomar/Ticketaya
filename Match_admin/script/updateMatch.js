document.addEventListener('DOMContentLoaded', () => {
    function fetchMatchDetails(matchId) {
        const token = localStorage.getItem('accessToken');
        fetch(`http://127.0.0.1:8000/match/retrive_one_match/${matchId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch match details');
            }
            return response.json();
        })
        .then(match => {
            document.getElementById('matchName').value = match.name;
            document.getElementById('team1').value = match.team1;
            document.getElementById('team2').value = match.team2;
            document.getElementById('stadium').value = match.stadium;
            document.getElementById('date').value = match.date; 
            document.getElementById('time').value = match.time; 
            document.getElementById('noTickets').value = match.no_tickets;
            document.getElementById('ticketPrice').value = match.ticket_price;
        })
        .catch(error => {
            console.error('Error fetching match details:', error);
            alert('Failed to fetch match details. Please check the match ID or your connection.');
        });
    }

    // Function to update match details
    function updateMatchDetails(matchId) {
        const token = localStorage.getItem('accessToken');
        const matchData = {
            name: document.getElementById('matchName').value,
            team1: document.getElementById('team1').value,
            team2: document.getElementById('team2').value,
            stadium: document.getElementById('stadium').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            no_tickets: document.getElementById('noTickets').value,
            ticket_price: document.getElementById('ticketPrice').value
        };

        fetch(`http://127.0.0.1:8000/match/update/${matchId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(matchData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update match');
            }
            return response.json();
        })
        .then(data => {
            alert('Match updated successfully!');
        })
        .catch(error => {
            console.error('Error updating match:', error);
            alert('Failed to update match. Please try again.');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');
    if (matchId) {
        fetchMatchDetails(matchId);
    }

    document.getElementById('updateButton').addEventListener('click', () => {
        if (matchId) {
            updateMatchDetails(matchId);
        }
    });

});
