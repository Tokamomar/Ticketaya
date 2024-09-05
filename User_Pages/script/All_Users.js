document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('userList');
    const searchBar = document.getElementById('searchBar');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    function renderUsers(filter = '') {
        userList.innerHTML = '';
        users
            .filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
            .forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `${user.username} <a href="User_Page.html?username=${user.username}" class="view-info-button">View Info</a>`;
                userList.appendChild(li);
            });
    }

    searchBar.addEventListener('input', function() {
        renderUsers(this.value);    
    });

    renderUsers();
});
