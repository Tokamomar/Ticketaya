// party.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const partyId = urlParams.get('id');

    if (!partyId) return;

    try {
        const response = await fetch(`https://your-api-endpoint/get-party/${partyId}`, {
            headers: {
                'Authorization': `Bearer ${yourJWTToken}` // replace with actual token
            }
        });
        
        const party = await response.json();

        document.getElementById('partyName').value = party.name;
        document.getElementById('partyDate').value = party.date;
        document.getElementById('partyLocation').value = party.location;
        
        document.getElementById('updatePartyForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('partyName').value;
            const date = document.getElementById('partyDate').value;
            const location = document.getElementById('partyLocation').value;

            try {
                const response = await fetch(`https://your-api-endpoint/update-party/${partyId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${yourJWTToken}` // replace with actual token
                    },
                    body: JSON.stringify({ name, date, location })
                });

                if (response.ok) {
                    alert('Party updated successfully!');
                } else {
                    alert('Failed to update party.');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });

        document.getElementById('deletePartyButton').addEventListener('click', async () => {
            try {
                const response = await fetch(`https://your-api-endpoint/delete-party/${partyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${yourJWTToken}` // replace with actual token
                    }
                });

                if (response.ok) {
                    alert('Party deleted successfully!');
                    window.location.href = '../index/allParties.html';
                } else {
                    alert('Failed to delete party.');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    } catch (error) {
        console.error('Error fetching party details:', error);
    }
});
