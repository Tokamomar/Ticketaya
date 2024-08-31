// document.getElementById("loginForm").addEventListener("submit", async function(event) {
//   event.preventDefault(); // Prevent the default form submission

//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   try {
//       const response = await fetch('http://localhost:8000/login/', { // Replace with your actual API endpoint
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//               username: username,
//               password: password
//           }),
//         mode: 'no-cors' // Avoid using this unless absolutely necessary, as it limits the response data you can access
//       });

//       if (response.ok) {
//           const data = await response.json();
//           // Handle successful login
//           console.log('Access:', data.access);
//           console.log('Refresh:', data.refresh);
//           console.log('User:', data.user);

//           // You can store tokens in localStorage or cookies
//           localStorage.setItem('access', data.access);
//           localStorage.setItem('refresh', data.refresh);

//           // Redirect user to a different page or update UI as needed
//           // window.location.href = 'signup.html'; // Example redirection after successful login
//       } else {
//           // Handle errors (e.g., wrong credentials)
//           const errorData = await response.json();
//           alert(errorData.message || "Login failed!");
//       }
//   } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred. Please try again later.');
//   }
// });
document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent the default form submission

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
      const response = await fetch('http://localhost:8000/login/', { // Replace with your actual API endpoint
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: username,
              password: password
          })
      });

      if (response.ok) {
          const data = await response.json();
          // Handle successful login
          console.log('Access:', data.access);
          console.log('Refresh:', data.refresh);
          console.log('User:', data.user);

          // You can store tokens in localStorage or cookies
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);

          // Redirect user to a different page or update UI as needed
          // window.location.href = 'signup.html'; // Example redirection after successful login
      } else {
          // Handle errors (e.g., wrong credentials)
          const errorData = await response.json();
          alert(errorData.message || "Login failed!");
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
  }
});