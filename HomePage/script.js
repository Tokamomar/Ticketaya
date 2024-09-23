// JavaScript to automatically change the background image of the landing section

const landing = document.querySelector('.landing');

// Array of background images
const backgrounds = [
    "url('images/slider1.jpg')",
    "url('images/slider2.jpg')",
    "url('images/slider3.jpg')"
];

let currentIndex = 0;

// Function to change background image
function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    landing.style.backgroundImage = backgrounds[currentIndex];
}

// Set interval to change the background every 5 seconds
setInterval(changeBackground, 5000);
// Get elements
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
