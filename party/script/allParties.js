document.addEventListener('DOMContentLoaded', function() {
    const matchList = document.getElementById('matchList');
    const searchBar = document.getElementById('searchBar');
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav'); 
    let matchesData = []; 
    const accessToken = localStorage.getItem('accessToken');



    fetch('http://127.0.0.1:8000/account/profile/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch profile data');
        }
    }).then(data => {
        // Show the user navigation and hide the guest navigation
        guestNav.style.display = 'none'; // Hide guest navigation
        userNav.style.display = 'block'; // Show user navigation

        userNav.querySelector('ul').innerHTML = `
        <li style="display: flex; align-items: center;">
           <a href="../../account/index/account.html">
            <img class="pfp" alt="Profile Picture" src="${data.image}" id="pfp"/>
            </a>
           <span class="username">${data.username}</span>
           <button class="logout_btn" id="logout_btn"><i class="fa-solid fa-sign-out"></i>Logout</button>
        </li>
`;

        // Logout button functionality
        const logoutBtn = document.getElementById('logout_btn');
        logoutBtn.addEventListener('click', () => {
            const refresh = localStorage.getItem("refreshToken");
            const logoutData = { refresh_token: refresh };
            fetch('http://127.0.0.1:8000/account/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logoutData),
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to logout");
                }
                return response.json();
            }).then(data => {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("accessToken");
                alert(data.msg);
                window.location.reload(); 
            }).catch(error => {
                console.error('Error during logout:', error);
            });
        });

    }).catch(error => {
        console.error('Error fetching user data:', error);
    });


    // Function to calculate and start the countdown for each match
function startCountdown(eventDate, countdownElement , bookBtn) {
    // Adjust the event date by subtracting 3 hours (in milliseconds)
    const adjustedEventDate = new Date(new Date(eventDate).getTime() - 3 * 60 * 60 * 1000);
  
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = adjustedEventDate.getTime() - now;
  
      if (distance < 0) {
        countdownElement.textContent = "Event Over!";
        if(bookBtn){
            bookBtn.style.display = "none";
        }
        return; // Stop updating if the event is over
      }
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  
    // Update countdown immediately and every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

    fetch('http://127.0.0.1:8000/parties', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` // replace with actual token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch parties');
        }
        return response.json();
    })
    .then(matches => {
        matchesData = matches; 
        displayMatches(matches);
    })
    .catch(error => {
        console.error('Error fetching parties:', error);
        alert('Unable to load parties. Please try again later.');
    });


    function displayMatches(matches) {
        matchList.innerHTML = ''; 
        matches.forEach((match,index) => {



        const cairoTime = new Date(match.datetime);

    // Subtract 3 hours from the event date
    cairoTime.setHours(cairoTime.getHours() - 3);

    // Format the date and time without timezone info
    const formattedCairoTime = cairoTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long", // Full month name like "January"
      day: "numeric", // Numeric day like "29"
      hour: "numeric", // Hour like "1" or "13"
      minute: "numeric", // Minute like "19"
      second: "numeric", // Optional, include if you want seconds
      hour12: true, // This option makes it 12-hour format with AM/PM
    });

    const isAvailable = match.avilable;

            matchList.innerHTML += `
                <div class="match-card">
                    <img src=${match.image} alt="${match.name}"> <!-- Placeholder image -->
                    <div class="match-info">
                        <h3>${match.name}</h3> <!-- Match name as heading -->
                        <div class="match-details">
                            <span>${match.performer}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                        <img class="stadium-icon" src="../images/location.jpg" alt="Stadium Icon" style="width: 20px; height: auto; margin-right: 5px;">
                            <span>${match.location}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                            <span>${formattedCairoTime}</span> <!-- Date and Time -->
                        </div>
                        <div class="match-details">
                            <span>Tickets: ${match.number_of_tickets}</span> <!-- Number of tickets -->
                        </div>
                        <div class="match-details">
                            <span>Price: $${Math.round(match.price)}</span> <!-- Ticket price without decimals -->
                        </div>
                        <div class="match-details">
                            <span>Description : ${match.description}</span> <!-- Match description -->
                        </div>
                    </div>
                    <div class="admin-match-actions" id="available-${index}">
                    ${isAvailable ? 
                        `<button class="book-ticket-btn" onclick="bookTicket(${match.id})" id="bookNow-${index}">Book Now</button>` :
                        `<span class="admin-match-actions">
                            <span style="color: red;">&#9679;</span> <!-- Red circle -->
                            <span">Not Available</span>
                        </span>`
                    }
                </div>
                    <div class="count_down" id="countdown-${index}"></div>
                </div>
            `;
        });
          // Start countdown for each match
  matches.forEach((match, index) => {
    const countdownElement = document.getElementById(`countdown-${index}`);
    startCountdown(match.datetime, countdownElement);
    const bookButton = document.getElementById(`bookNow-${index}`);
        startCountdown(match.datetime, countdownElement, bookButton);
  });
    }

    // Search matches
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMatches = matchesData.filter(match => 
            match.name.toLowerCase().includes(searchTerm)|| 
            match.location.toLowerCase().includes(searchTerm) || 
            match.performer.toLowerCase().includes(searchTerm)
        );
        displayMatches(filteredMatches);
    });
});

// Function to handle ticket booking
function bookTicket(partyId) {
    // alert(`party id is : `  + partyId);
    window.location.href = `ticketBooking.html?partyId=${partyId}`; 
}
