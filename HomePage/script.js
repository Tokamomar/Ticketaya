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
const openAbout = document.getElementById('openAbout');
const popup = document.getElementById('aboutUsPopup');
const closeBtn = document.querySelector('.close-btn');

// Open popup when link is clicked
openAbout.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default link behavior
    popup.style.display = 'flex';
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
        window.location.href="../Registration/index/login.html"; 
    }).catch(error => {
        console.error('Error during logout:', error);
    });
});