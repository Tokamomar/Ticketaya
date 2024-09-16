const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
console.log(menuBar)
console.log(sidebar)
menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

// Dropdown Menu
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        dropdownBtns.forEach(otherBtn => {
            if (otherBtn !== this) {
                const otherDropdown = otherBtn.nextElementSibling;
                const otherItem = otherBtn.closest('.dropdown-item');
                otherDropdown.classList.remove('active');
                otherBtn.querySelector('.arrow').classList.remove('rotate');
                otherItem.classList.remove('custom-style');
               
            }
        });

        let dropdownContent = this.nextElementSibling;
        const item = this.closest('.dropdown-item'); 
        
        dropdownContent.classList.toggle('active');
        item.classList.toggle('custom-style');
        
        let arrowIcon = this.querySelector('.arrow');
        arrowIcon.classList.toggle('rotate');

    });
});
