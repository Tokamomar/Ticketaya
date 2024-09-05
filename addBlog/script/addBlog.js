//! this is an alert 
//todo  
//? this is for questions 

const toggleOptions = document.querySelectorAll('.toggle-option');

toggleOptions.forEach(option => {
  option.addEventListener('click', function() {
    toggleOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
  });
});
