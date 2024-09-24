document.getElementById('addMatchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Fetch the accessToken for authorization
    const token = localStorage.getItem('accessToken');
    
    const name = document.getElementById('matchName').value;
    const team1 = document.getElementById('team1').value;
    const team2 = document.getElementById('team2').value;
    const date = document.getElementById('matchDate').value;  
    const time = document.getElementById('matchTime').value;  
    const stadium = document.getElementById('stadium').value;
    const no_tickets = document.getElementById('ticketCount').value;  
    const ticket_price = document.getElementById('ticketPrice').value;
    const description = document.getElementById('description').value;

    const matchData = {
        name: name,
        team1: team1,
        team2: team2,
        date: date,
        time: time,
        stadium: stadium,
        no_tickets: no_tickets,
        ticket_price: ticket_price,
        description: description
    };

    fetch('http://127.0.0.1:8000/match/addnewmatch/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(matchData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add match');
        }
        return response.json();
    })
    .then(data => {
        // Show success message and redirect to dashboard
        alert('New match added successfully!');
        window.location.href = 'matchManagement.html'; 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding match');
    });
});
