document.addEventListener('DOMContentLoaded', function () {
    const matchList = document.getElementById('matchList');
    const searchBar = document.getElementById('searchBar');
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const accessToken = localStorage.getItem('accessToken');
    let matchesData = [];

    // Check if the user is logged in
    if (accessToken) {
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
            guestNav.style.display = 'none'; 
            userNav.style.display = 'block'; 

            userNav.querySelector('ul').innerHTML = `
            <li style="display: flex; align-items: center;">
               <a href="../../account/index/account.html">
                <img class="pfp" alt="Profile Picture" src="${data.image}" id="pfp"/>
                </a>
               <span class="username">${data.username}</span>
               <li><a href="#footer" id="contact-link"><i class="fa-solid fa-phone"></i><p>Contact Us</p></a></li>
               <button class="logout_btn" id="logout_btn"><i class="fa-solid fa-sign-out"></i> Logout</button>
            </li>
            `;

            // Logout button 
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
    } else {
        // If not logged in, show the guest navigation and hide the user navigation
        guestNav.style.display = 'block'; 
        userNav.style.display = 'none'; 
    }

    // Fetch all matches
    fetch('http://127.0.0.1:8000/match/retrive_all_match/', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }
            return response.json();
        })
        .then(matches => {
            matchesData = matches;
            displayMatches(matches);
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            alert('Unable to load matches. Please try again later.');
        });

    // Function to format date
    function formatDate(dateString) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to format time with null check
    function formatTime(timeString) {
        if (!timeString) return 'Time not available';  

        let [hours, minutes] = timeString.split(':');
        let period = 'AM';

        hours = parseInt(hours, 10);

        if (hours >= 12) {
            period = 'PM';
            if (hours > 12) hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        return `${hours}:${minutes} ${period}`;
    }

    function displayMatches(matches) {
        matchList.innerHTML = '';

        if (matches.length === 0) {
            matchList.innerHTML = '<p class="no-matches">No matches found.</p>'; 
            return;
        }

        const currentDate = new Date();

        matches.forEach(match => {
            const matchDate = new Date(match.date); 
            const matchTime = formatTime(match.time);
            const isMatchEnded = matchDate < currentDate;

            matchList.innerHTML += `
                <div class="match-card">
                    <div class="matchPhoto">
                        <img src="${match.image}" alt="${match.name}" class="match-image"> <!-- Use match.image field -->
                    </div>
                    <div class="match-info">
                        <h3>${match.name}</h3> <!-- Match name as heading -->
                        <div class="match-details">
                            <span>${match.team1} vs ${match.team2}</span> <!-- Teams -->
                        </div>
                        <div class="match-details">
                            <img class="stadium-icon" src="../images/stadium.png" alt="Stadium Icon" style="width: 20px; height: auto; margin-right: 5px;">
                            <span>${match.stadium}</span> <!-- Stadium -->
                        </div>
                        <div class="match-details">
                            <span>${formatDate(match.date)} | ${matchTime}</span> <!-- Date and Time -->
                        </div>
                        <div class="match-details">
                            <span>Tickets: ${match.no_tickets}</span> <!-- Number of tickets -->
                        </div>
                        <div class="match-details">
                            <span>Price: $${Math.round(match.ticket_price)}</span> <!-- Ticket price without decimals -->
                        </div>
                    </div>
                    <div class="admin-match-actions">
                    ${isMatchEnded
                    ? `<span style="color: black; margin-top: 15px; margin-right: 15px;">
                               <i class="fa fa-circle" style="color: #DB504A; font-size: 0.8em;" aria-hidden="true"></i> Match Ended
                           </span>`
                    : `<button class="book-ticket-btn" onclick="bookTicket(${match.id})">Book Now</button>`
                }
                    </div>
                </div>
            `;
        });
    }

    // Search matches by name
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMatches = matchesData.filter(match =>
            match.name.toLowerCase().includes(searchTerm) ||
            match.team1.toLowerCase().includes(searchTerm) ||
            match.team2.toLowerCase().includes(searchTerm)
        );
        displayMatches(filteredMatches);
    });
});

// Function to handle ticket booking
function bookTicket(matchId) {
    window.location.href = `ticketBooking.html?matchId=${matchId}`;
}
