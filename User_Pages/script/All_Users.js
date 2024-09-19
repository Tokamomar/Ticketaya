document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('userList');
    const searchBar = document.getElementById('searchBar');
    // const token = localStorage.getItem('jwtToken'); 


    function renderUsers(users, filter = '') {
        userList.innerHTML = '';
        users
            .filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
            .forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `${user.username} <a href="User_Page.html?username=${encodeURIComponent(user.username)}" class="view-info-button">View Info</a>`;
                userList.appendChild(li);
            });
    }

    function fetchUsers() {
        fetch('http://127.0.0.1:8000/account/listusers/', {
            method: 'GET',
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // }
        })
        .then(response => response.json())
        .then(data => {
            renderUsers(data); 
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            userList.innerHTML = '<p>Error loading users. Please try again later.</p>';
        });
    }

    searchBar.addEventListener('input', function() {
        fetchUsers();
    });

    fetchUsers();
});
