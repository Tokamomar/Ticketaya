document.getElementById('addMatchForm').addEventListener('submit', function(event) {
    event.preventDefault();

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
    const imageFile = document.getElementById('matchImage').files[0]; 

    const matchData = new FormData();
    matchData.append('name', name);
    matchData.append('team1', team1);
    matchData.append('team2', team2);
    matchData.append('date', date);
    matchData.append('time', time);
    matchData.append('stadium', stadium);
    matchData.append('no_tickets', no_tickets);
    matchData.append('ticket_price', ticket_price);
    matchData.append('description', description);
    matchData.append('image', imageFile); 

    fetch('http://127.0.0.1:8000/match/addnewmatch/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` 
        },
        body: matchData 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add match');
        }
        return response.json();
    })

    .then(data => {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('successMessage').style.display = 'block';

        setTimeout(() => {
            window.location.href = 'matchManagement.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding match');
    });
});
