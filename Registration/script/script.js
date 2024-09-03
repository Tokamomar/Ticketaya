
const closeBtns = document.getElementsByClassName('closeBtn');
for (const closeBtn of closeBtns) {
    closeBtn.addEventListener('click', () => {
        const popupContainers = document.getElementsByClassName('popup-container');
        for (const popupContainer of popupContainers) {
            popupContainer.style.display = 'none';
        }
        window.location.href = '../index/login.html'
    });
}