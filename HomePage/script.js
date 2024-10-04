document.addEventListener('DOMContentLoaded', function () {
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const userProfile = document.getElementById('userProfile');
    const logoutBtn = document.getElementById('logoutBtn');
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        // If logged in, display user information
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
            userNav.style.display = 'flex'; 

            userProfile.style.display = 'flex'; 
            userNav.querySelector('#pfp').src = data.image;
            userNav.querySelector('.username').textContent = data.username; 

            // Logout button 
            logoutBtn.style.display = 'block'; 
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
        guestNav.style.display = 'flex'; 
        userNav.style.display = 'none'; 
    }
});


const landing = document.querySelector('.landing');

// Array of background images
const backgrounds = [
    "url('images/slider1.jpg')",
    "url('images/slider2.jpg')",
    "url('images/slider3.jpg')",
    "url('images/slider4.jpg')"
];

let currentIndex = 0;

// Preload images
function preloadImages(urls) {
    urls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}
preloadImages([
    'images/slider1.jpg',
    'images/slider2.jpg',
    'images/slider3.jpg',
    'images/slider4.jpg'
]);

// Function to change background image
function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    landing.style.backgroundImage = backgrounds[currentIndex];
}

// Set initial background image
landing.style.backgroundImage = backgrounds[currentIndex];

// Set interval to change the background every 5 seconds
setInterval(changeBackground, 5000);

// Get elements for the popup
const openAboutButtons = document.querySelectorAll('#openAbout');
const popup = document.getElementById('aboutUsPopup');
const closeBtn = document.querySelector('.close-btn');

// Open popup when link is clicked
openAboutButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        aboutUsPopup.style.display = 'block';
    });
});
// Close popup when 'x' button is clicked
closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
});

// Close popup when clicking outside the content
window.addEventListener('click', function(event) {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
});
