document.addEventListener('DOMContentLoaded', () => {
    function fetchMatchDetails(matchId) {
        const token = localStorage.getItem('accessToken');
        console.log('Access Token:', token);
        console.log('Match ID:', matchId);
        
        fetch(`http://127.0.0.1:8000/match/retriveonematch/${matchId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
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
            document.getElementById('matchDate').value = match.date; 
            document.getElementById('matchTime').value = match.time; 
            document.getElementById('ticketCount').value = match.no_tickets; 
            document.getElementById('ticketPrice').value = match.ticket_price;

            // Handle image 
            if (match.image) {
                document.getElementById('currentImage').src = match.image;
                document.getElementById('currentImage').style.display = 'block'; 
            }
        })
        .catch(error => {
            console.error('Error fetching match details:', error);
            alert('Failed to fetch match details. Please check the match ID or your connection.');
        });
    }

    // Function to update match details
    function updateMatchDetails(matchId) {
        const token = localStorage.getItem('accessToken');
        
        const formData = new FormData();
        formData.append('name', document.getElementById('matchName').value);
        formData.append('team1', document.getElementById('team1').value);
        formData.append('team2', document.getElementById('team2').value);
        formData.append('stadium', document.getElementById('stadium').value);
        formData.append('date', document.getElementById('matchDate').value);
        formData.append('time', document.getElementById('matchTime').value);
        formData.append('no_tickets', document.getElementById('ticketCount').value);
        formData.append('ticket_price', document.getElementById('ticketPrice').value);

        const imageFile = document.getElementById('matchImage').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch(`http://127.0.0.1:8000/match/updatematch/${matchId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            console.log('Update Response status:', response.status);
            if (!response.ok) {
                throw new Error('Failed to update match');
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
            console.error('Error updating match:', error);
            alert('Failed to update match. Please try again.');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');
    if (matchId) {
        fetchMatchDetails(matchId);
    }

    document.getElementById('updateMatchButton').addEventListener('click', () => {
        updateMatchDetails(matchId);
    });
});
