let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
}

document.querySelectorAll('.about .video-container .controls .control-btn').forEach(btn =>{
    btn.onclick = () =>{
        let src = btn.getAttribute('data-src');
        document.querySelector('.about .video-container .video').src = src;
    }
})

// Get modal elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
// const bookingModal = document.getElementById('bookingModal');

// Get buttons to open modals
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
// const bookingButton = document.querySelectorAll('.rent');

// Get close buttons for modals
const loginClose = document.getElementById('loginClose');
const registerClose = document.getElementById('registerClose');
// const bookingClose = document.getElementById('bookingClose');

// Function to open the login modal
loginButton.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// 

// Function to open the register modal
registerButton.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

// Function to close the login modal
loginClose.addEventListener('click', () => {
  loginModal.style.display = 'none';
});


// Function to close the register modal
registerClose.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

// Close modals when clicking outside of them
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    
 
});
window.addEventListener('click', (e) => {
 
  if (e.target === registerModal) {
    registerModal.style.display = 'none';
  }
  // if (e.target === bookingModal) {
  //   bookingModal.style.display = 'none';
  //   }
});



// Function to handle login form submission
// Function to handle registration form submission
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting normally

  // Get input values
  const registerName = document.getElementById('registerName').value;
  const registerEmail = document.getElementById('registerEmail').value;
  const registerPassword = document.getElementById('registerPassword').value;

  // Robust validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registerEmail)) {
      alert('Invalid email address.');
      return;
  }

  // Robust validation for password (minimum length)
  if (registerPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
  }

  // Store user data in localStorage (for simplicity)
  const userData = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
  };

  localStorage.setItem(registerEmail, JSON.stringify(userData));

  // After successful registration, you can redirect the user or perform other actions
  alert('Registration successful! Redirecting to login...');
  document.getElementById('registerModal').style.display = 'none'; // Close the registration modal
  document.getElementById('loginModal').style.display = 'block'; // Show the login modal
});

// Function to handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting normally

  // Get input values
  const loginEmail = document.getElementById('loginEmail').value;
  const loginPassword = document.getElementById('loginPassword').value;

  // Robust validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginEmail)) {
      alert('Invalid email address.');
      return;
  }

  // Check if the user exists in localStorage
  const userData = JSON.parse(localStorage.getItem(loginEmail));

  if (userData && userData.password === loginPassword) {
      // Successful login
      alert('Login successful! Redirecting to the dashboard...');
      document.getElementById('loginModal').style.display = 'none'; // Close the login modal
      window.location.href = 'dashboard.html'; // Redirect to the dashboard
  } else {
      // Failed login
      alert('Invalid email or password. Please try again.');
  }
});

function toggleProfileDropdown() {
  const dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.classList.toggle('active');
}





class Accordion {
    constructor(el) {
      this.el = el;
      this.summary = el.querySelector('summary');
      this.content = el.querySelector('.faq-content');
      this.expandIcon = this.summary.querySelector('.expand-icon')
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.summary.addEventListener('click', (e) => this.onClick(e));
    }
  
    onClick(e) {
      e.preventDefault();
      this.el.style.overflow = 'hidden';

      if (this.isClosing || !this.el.open) {
        this.open();
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }
  
    shrink() {
      this.isClosing = true;

      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight}px`;

      if (this.animation) {
        this.animation.cancel();
      }
      
      this.animation = this.el.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });

      this.animation.onfinish = () => {
        this.expandIcon.setAttribute('src', './assets/images/plus.svg');
        return this.onAnimationFinish(false);
      }
      this.animation.oncancel = () => {
        this.expandIcon.setAttribute('src', './assets/images/plus.svg');
        return this.isClosing = false;
      }
    }
  
    open() {
      this.el.style.height = `${this.el.offsetHeight}px`;
      this.el.open = true;
      window.requestAnimationFrame(() => this.expand());
    }
  
    expand() {
      this.isExpanding = true;

      const startHeight = `${this.el.offsetHeight}px`;
      const endHeight = `${this.summary.offsetHeight + 
                           this.content.offsetHeight}px`;

      if (this.animation) {
        this.animation.cancel();
      }
      
      this.animation = this.el.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 350,
        easing: 'ease-out'
      });

      this.animation.onfinish = () => {
        this.expandIcon.setAttribute(
            'src',
            './assets/images/minus.svg'
        );
        return this.onAnimationFinish(true);
      }
      this.animation.oncancel = () => {
        this.expandIcon.setAttribute(
            'src',
            './assets/images/minus.svg'
        );
        return this.isExpanding = false;
      }
    }
  
    onAnimationFinish(open) {
      this.el.open = open;
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.el.style.height = this.el.style.overflow = '';
    }
  }
  
  document.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
  });

