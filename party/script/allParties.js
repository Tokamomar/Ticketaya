// allParties.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://your-api-endpoint/get-parties', {
            headers: {
                'Authorization': `Bearer ${yourJWTToken}` // replace with actual token
            }
        });
        
        const parties = await response.json();
        const cardsContainer = document.querySelector('.cards');

        cardsContainer.innerHTML = ''; // Clear existing cards

        parties.forEach(party => {
            const cardHTML = `
                <div class="card">
                    <img src="${party.photo || '../images/default.jpg'}" style="width:100%">
                    <h1>${party.name}</h1>
                    <p class="title">${party.date}</p>
                    <p>${party.location}</p>
                    <p><button><a href="../index/party.html?id=${party.id}">Party Details</a></button></p>
                </div>
            `;
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error('Error fetching parties:', error);
    }
});
