
let matchesData = [];

// Function to calculate and start the countdown for each match
function startCountdown(eventDate, countdownElement) {
    // Adjust the event date by subtracting 3 hours (in milliseconds)
    const adjustedEventDate = new Date(new Date(eventDate).getTime() - 3 * 60 * 60 * 1000);
  
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = adjustedEventDate.getTime() - now;
  
      if (distance < 0) {
        countdownElement.textContent = "Event Over!";
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
  
// Function to display the matches with countdown and details
function displayMatches(matches) {
  const matchList = document.getElementById("matchList");
  matchList.innerHTML = "";
  
  matches.forEach((match, index) => {
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
      <div class="admin-match">
        <img src=${match.image} alt="${match.name}" class="party_img">
        <div class="admin-match-info">
          <h2>${match.name}</h2>
          <div class="match-details">
            <span>${match.performer}</span>
          </div>
          <div class="match-details">
            <img class="stadium-icon" src="../images/location.jpg" alt="">
            <span>${match.location}</span>
          </div>
          <div class="match-details">
            <span>${formattedCairoTime}</span>
          </div>
          <div class="match-details">
            <span>Tickets: ${match.number_of_tickets}</span>
          </div>
          <div class="match-details">
            <span>Price: $${Math.floor(match.price)}</span>
          </div>
          <div class="match-details">
            <span>Description: ${match.description}</span>
          </div>
        </div>
        <div class="admin-match-actions">
          <button class="update-btn" onclick="editMatch(${match.id})">Update</button>
          <button class="delete-btn" onclick="deleteMatch(${match.id})">Delete</button>
        </div>
        <div class="admin-match-actions" id="available-${index}" style="margin-right:20px">
                    ${isAvailable ? 
                        `` :
                        `<span class="admin-match-actions availability">
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
  });
}

// Function to fetch all matches
function fetchMatches() {
  const token = localStorage.getItem("accessToken");
  fetch("http://127.0.0.1:8000/parties", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }
      return response.json();
    })
    .then((matches) => {
      matchesData = matches;
      displayMatches(matches);
    })
    .catch((error) => {
      console.error("Error fetching matches:", error);
      setTimeout(() => {
        // Handle redirection or other error actions
      }, 2000);
    });
}

window.editMatch = function (matchId) {
  window.location.href = `../index/edit_party.html?editParty=${matchId}`;
};

// Function to delete a match
window.deleteMatch = function (matchId) {
  const token = localStorage.getItem("accessToken");
  const confirmation = confirm("Are you sure you want to delete this party?");
  if (confirmation) {
    matchesData = matchesData.filter((match) => match.id !== matchId);
    displayMatches(matchesData);

    fetch(`http://127.0.0.1:8000/parties/${matchId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete party");
        }
        alert("Party deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting party:", error);
        alert("Failed to delete the party. Refreshing data.");
        fetchMatches();
      });
  }
};

// Event listener for the search bar and fetching matches on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchMatches();

  // Search matches by name
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredMatches = matchesData.filter(
      (match) =>
        match.name.toLowerCase().includes(searchTerm) ||
        match.location.toLowerCase().includes(searchTerm) ||
        match.performer.toLowerCase().includes(searchTerm)
    );
    displayMatches(filteredMatches);
  });
});

const back = document.getElementById('back')
back.addEventListener('click', () => {
  window.location.href = '../../Admin_Panel/index/AdminPanel.html'
})