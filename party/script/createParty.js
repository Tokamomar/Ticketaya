const accessToken = localStorage.getItem("accessToken")

document.getElementById('createparty').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const performer = document.getElementById('performer').value;
    const price = document.getElementById('price').value;
    const tickets = document.getElementById('tickets').value;

    partyData = {
        name : name , 
        datetime : date ,
        location : location ,
        performer : performer ,
        price : price ,
        number_of_tickets : tickets ,
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/parties/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // replace with actual token
            },
            body: JSON.stringify(partyData)

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
