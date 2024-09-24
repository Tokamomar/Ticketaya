const accessToken = localStorage.getItem('accessToken');

const partyId = Number(JSON.parse(localStorage.getItem('partyId')));
console.log(partyId)

fetch(`http://127.0.0.1:8000/parties/${partyId}` , {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`
        }
}).then(response=>{
    if(response.ok){
        return response.json();
        }
        else{
            alert("can not get  the party details");
        }
}).then(party=>{
    // Populate the HTML elements with the data from the API
    document.getElementById('name').textContent = party.name;
    document.getElementById('performer').textContent = `Performer: ${party.performer}`;
    //document.getElementById('description').textContent = `Description: ${party.description}`; // Assuming your API has a 'description' field
    document.getElementById('location').textContent = `Location: ${party.location}`;
    document.getElementById('datetime').textContent = `Date: ${new Date(party.datetime).toLocaleDateString()} at ${new Date(party.datetime).toLocaleTimeString()}`;
    document.getElementById('tickets').textContent = `${party.number_of_tickets} tickets left`;
    document.getElementById('price').textContent = `${party.price} LE`;

    // Function to calculate the countdown
    function calculateCountdown(eventDate) {
        const now = new Date().getTime();
        const distance = new Date(eventDate).getTime() - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            return "Event Over!";
        }

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Set the countdown timer
    document.getElementById('countDown').textContent = calculateCountdown(party.datetime);

    // Update the countdown every second
    setInterval(() => {
        document.getElementById('countDown').textContent = calculateCountdown(party.datetime);
    }, 1000);
})