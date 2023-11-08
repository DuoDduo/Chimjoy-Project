    let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
}

    // Function to switch tabs
    function switchTab(tabId) {
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach((content) => {
        content.classList.remove('active');
      });
  
      // Deactivate all tab links
      const tabLinks = document.querySelectorAll('.tabs a');
      tabLinks.forEach((link) => {
        link.classList.remove('active');
      });
  
      // Show the selected tab content
      const selectedTab = document.getElementById(tabId + '-content');
      selectedTab.classList.add('active');
  
      // Activate the clicked tab link
      const selectedTabLink = document.getElementById(tabId);
      selectedTabLink.classList.add('active');
    }
  
    // Add click event listeners to the tab links
    const tabLinks = document.querySelectorAll('.tabs a');
    tabLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const tabId = link.getAttribute('href').substr(1); // Get the target tab id
        switchTab(tabId);
      });
    });
  
    // Initially, display the first tab
    switchTab('tab1');

function getCurrentLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const pickupInput = document.getElementById('pickup');
          const pickupNearby = document.getElementById('pickupNearby');
          const pickupNearbyLabel = document.getElementById('pickupNearbyLabel');

          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Make a request to the Geocoding API
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`)
              .then(response => response.json())
              .then(data => {
                  if (data.status === 'OK' && data.results[0]) {
                      const address = data.results[0].formatted_address;
                      pickupInput.value = address;
                      // Show nearby pickup location fields
                      pickupNearby.style.display = 'block';
                      pickupNearbyLabel.style.display = 'block';
                  } else {
                      pickupInput.value = `Lat: ${latitude}, Long: ${longitude}`;
                  }
              })
              .catch(error => {
                  console.error('Error fetching geolocation data:', error);
                  pickupInput.value = `Lat: ${latitude}, Long: ${longitude}`;
              });
      });
  } else {
      alert('Geolocation is not supported by your browser.');
  }
}

// JavaScript function to suggest destinations (as provided in previous examples)

// Update the suggestDestinations function to show nearby destination fields
function suggestDestinations() {
  const destinationInput = document.getElementById('destination');
  const destinationNearby = document.getElementById('destinationNearby');
  const destinationNearbyLabel = document.getElementById('destinationNearbyLabel');
  
  // Clear the previous suggestions and hide nearby destination fields
  destinationNearby.innerHTML = '';
  destinationNearby.style.display = 'none';
  destinationNearbyLabel.style.display = 'none';

  // Example: A list of static destination suggestions (replace with real API call)
  const destinationSuggestionsList = [
      'Airport',
      'Downtown',
      'Shopping Mall',
      'Restaurant',
      'Hotel',
  ];

  const userInput = destinationInput.value.toLowerCase();
  
  // Filter suggestions based on user input
  const filteredSuggestions = destinationSuggestionsList.filter(suggestion =>
      suggestion.toLowerCase().includes(userInput)
  );

  // Display filtered suggestions
  if (filteredSuggestions.length > 0) {
      filteredSuggestions.forEach(suggestion => {
          const suggestionElement = document.createElement('div');
          suggestionElement.textContent = suggestion;
          suggestionElement.classList.add('suggestion-item');
          suggestionElement.addEventListener('click', () => {
              // Fill the destination input field with the selected suggestion
              destinationInput.value = suggestion;
              // Show nearby destination fields
              destinationNearby.style.display = 'block';
              destinationNearbyLabel.style.display = 'block';
              // Clear the suggestions
              destinationSuggestions.innerHTML = '';
          });
          destinationNearby.appendChild(suggestionElement);
      });
  }
}
