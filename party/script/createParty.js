// createParty.js

document.getElementById('createparty').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;

    try {
        const response = await fetch('https://your-api-endpoint/create-party', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${yourJWTToken}` // replace with actual token
            },
            body: JSON.stringify({ name, date, location })
        });

        if (response.ok) {
            document.getElementById('message').textContent = 'Party created successfully!';
            document.getElementById('createparty').reset();
        } else {
            document.getElementById('message').textContent = 'Failed to create party.';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error: ' + error.message;
    }
});
