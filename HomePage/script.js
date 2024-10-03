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
