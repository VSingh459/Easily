const jo = document.getElementsByClassName('iaJ')[0];
jo.addEventListener('click', function(){
    window.location.href = '/job';
})

const modal = document.getElementById('registerModal');
    const openModalBtn = document.getElementById('iaR');
    const closeModal = document.getElementsByClassName('close')[0];

    openModalBtn.onclick = () => modal.style.display = 'block';
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = event => { if (event.target == modal) modal.style.display = 'none'; };

    //Client Side validation of registration form/modal

    document.querySelector('form').addEventListener('submit', function(event) {
        console.log("Validation script loaded");
        const name = document.querySelector('input[name="name"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const password = document.querySelector('input[name="password"]').value.trim();
      
        if (!name || !email || !password) {
          alert('Please fill out all fields.');
          event.preventDefault();
          return;
        }
      
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          alert('Please enter a valid email address.');
          event.preventDefault();
          return;
        }
      
        if (password.length < 6) {
          alert('Password must be at least 6 characters.');
          event.preventDefault();
        }


      });

      const tl = document.getElementsByClassName('login-btn')[0];
      const tlo = document.getElementById('loginModal');
      tl.addEventListener('click', function(){
        modal.style.display = 'none'; // Close registration modal
        tlo.style.display = 'block';

      });

      const t2 = document.getElementsByClassName('kloso')[0];
      t2.addEventListener('click',function(){
        console.log('Hello45');
        modal.style.display = 'none'; // Close registration modal
        tlo.style.display = 'none';
      });

      window.addEventListener('click', (event) => {
        if (event.target == registerModal) {
            modal.style.display = 'none';
        } else if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Client side validation of Login Modal/form

// Client-Side Validation for Login Modal
document.querySelector('#loginModal form').addEventListener('submit', function(event) {
  const email = document.querySelector('#loginModal input[name="email2"]').value.trim();
  const password = document.querySelector('#loginModal input[name="password2"]').value.trim();

  // Check if both fields are filled
  if (!email || !password) {
      alert('Please fill out both email and password fields.');
      event.preventDefault(); // Prevent form submission if validation fails
      return;
  }

  // Check if the email format is valid
  if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      event.preventDefault(); // Prevent form submission if validation fails
      return;
  }
});

      