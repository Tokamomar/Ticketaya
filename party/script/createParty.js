


const accessToken = localStorage.getItem("accessToken");

document.getElementById('createparty').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const performer = document.getElementById('performer').value;
    const price = document.getElementById('price').value;
    const tickets = document.getElementById('tickets').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    // Create a Date object from the input date
    const eventDate = new Date(date);
    
    // Subtract 3 hours from the event date
    eventDate.setHours(eventDate.getHours());
    
    // Format the date back to a string in ISO format (or your desired format)
    const formattedDate = eventDate.toISOString(); // This will be in UTC time

    partyData = {
        name: name,
        datetime: formattedDate, // Use the modified date here
        location: location,
        performer: performer,
        price: price,
        number_of_tickets: tickets,
        description : description
    };

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
