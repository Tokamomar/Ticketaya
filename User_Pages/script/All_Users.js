document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('userList');
    const searchBar = document.getElementById('searchBar');
    const token = localStorage.getItem('accessToken'); 

    let usersData = []; // Store fetched users data

    function renderUsers(filter = '') {
        userList.innerHTML = '';
        usersData
            .filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
            .forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `${user.username} <a href="User_Page.html?id=${encodeURIComponent(user.id)}" class="view-info-button">View Info</a>`;
                userList.appendChild(li);
            });
    }

    function fetchUsers() { 
        fetch('http://127.0.0.1:8000/account/listusers/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            usersData = data; 
            renderUsers(); 
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            userList.innerHTML = '<p>Error loading users. Please try again later.</p>';
        });
    }

    searchBar.addEventListener('input', function() {
        const filterValue = searchBar.value.trim();
        renderUsers(filterValue); 
    });

    fetchUsers();
});
