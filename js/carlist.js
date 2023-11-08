let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
}

window.onscroll = () => {
  navbar.classList.remove('active');
}

const container = document.getElementById("carList");
const filterNameInput = document.getElementById("filterName");
const filterMinPriceInput = document.getElementById("filterMinPrice");
const filterMaxPriceInput = document.getElementById("filterMaxPrice");
const applyFilterButton = document.getElementById("applyFilter");
const resetFilterButton = document.getElementById("resetFilter");

let carListings = []; // To store the original car listings

// Function to render car listings
function renderCarListings(listings) {
  container.innerHTML = ""; // Clear the existing listings

  listings.forEach((listing) => {
    const listingElement = document.createElement("li");
    listingElement.id = listing.id;
    listingElement.innerHTML = `
      <div id=" " class="featured-car-card">
        <figure class="card-banner">
          <img src="./assets/images/${listing.car.image}" alt="${listing.car.name}" loading="lazy" width="440" height="300" class="w-100">
        </figure>
        <div class="card-content">
          <div class="card-title-wrapper">
            <h3 class="h3 card-title">
              <a href="#">${listing.car.name}</a>
            </h3>
            <data class="year" value="${listing.car.year}">${listing.car.year}</data>
          </div>
          <ul class="card-list">
            ${listing.car.description.map((item) => {
              const [iconClass, descriptionText] = item.split(' ');
              return `
                <li class="card-list-item">
                  <i class="fas ${iconClass}"></i>
                  <span class="card-item-text">${descriptionText}</span>
                </li>
              `;
            }).join('')}
          </ul>
          <div class="card-price-wrapper">
            <p class="card-price">
              <strong>Per Hour &nbsp ₦${listing.car.price}</strong>&nbsp
              </p>
            <p class="card-price">
            <strong>Per Day &nbsp ₦${listing.car.priceperday}</strong>
            </p>
            <button class="btns rent" style="margin:auto;">Hire Now</button>
          </div>
        </div>
      </div>
    `;
    const carId = listing.id;
    listingElement.querySelector(".featured-car-card").id = carId;
    container.appendChild(listingElement);
  });
}

// Function to calculate the number of days between two dates
function calculateNumberOfDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return 0; // Return 0 days if the return date is before the pickup date
  }

  const timeDifference = end - start;
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return days;
}

function fetchCarDetails(carId) {
  // Find the car listing with the specified carId
  const carListing = carListings.find((listing) => listing.id === carId);

  if (carListing) {
    const carName = carListing.car.name;
    const carPrice = carListing.car.price;
    const carPricePerDay = carListing.car.priceperday;

    return { carName, carPrice, carPricePerDay };
  }

  return null;
}


let selectedCarId = null;

container.addEventListener("click", function (event) {
  if (event.target.classList.contains("rent")) {
    const listingElement = event.target.closest(".featured-car-card");
    if (listingElement) {
      selectedCarId = listingElement.id; // Store the selected car ID
      displayBookingModal(selectedCarId);
    }
  }
});

function displayBookingModal(carId) {
 
    const modal = document.getElementById("bookingModal");
  
    if (modal) {
      modal.style.display = "block";
  
      // Fetch the car details
      const carDetails = fetchCarDetails(carId);
  
      if (carDetails) {
        // Update the booking form with the car name and price
        const carNameElement = document.getElementById("carName");
        const carPriceElement = document.getElementById("carPrice");
        const carPricePerDayElement = document.getElementById("carPricePerDay");
  
        if (carNameElement && carPriceElement && carPricePerDayElement) {
          carNameElement.textContent = carDetails.carName;
          carPriceElement.textContent = `₦${carDetails.carPrice}`;
          carPricePerDayElement.textContent = `₦${carDetails.carPricePerDay}`;
        }
      }

    // Clear the input fields for the new booking
    const pickupDateDayInput = document.getElementById("pickupDateDay");
    const numberOfDaysInput = document.getElementById("numberOfDays");
    const numberOfHoursInput = document.getElementById("numberOfHours");
    const pickupDateInput = document.getElementById("pickupDate");
    const returnDateInput = document.getElementById("returnDate");
    const TimeInput = document.getElementById("pickupTime");
    const returnTimeInput = document.getElementById("returnTime");

    if (pickupDateDayInput && TimeInput && pickupDateInput && returnDateInput && returnTimeInput ) {
      pickupDateDayInput.value = "";
      TimeInput.value = "";
      pickupDateInput.value = "";
      returnDateInput.value = "";
      returnTimeInput.value = "";
      numberOfHoursInput.value = "";
      numberOfDaysInput.value = "";
    }
  }
}

// Function to close the booking modal
function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  modal.style.display = "none";
}

// Event listener to close the modal when the close button or overlay is clicked
const modal = document.getElementById("bookingModal");
modal.addEventListener("click", function (event) {
  if (event.target === modal || event.target.classList.contains("close")) {
    closeBookingModal();
  }
});

// Event listener to submit the booking form
const bookingForm = document.getElementById("bookingForm");
bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();


});

// Fetch car listings from the JSON file and store them in carListings
fetch("carlisting.json")
  .then((response) => response.json())
  .then((data) => {
    carListings = data;
    renderCarListings(carListings); // Initial render of all listings
  })
  .catch((error) => {
    console.error("Error fetching car listings:", error);
  });



// Function to apply the filter based on user input
function applyFilter() {
  const nameFilter = filterNameInput.value.trim().toLowerCase();
  const minPrice = parseFloat(filterMinPriceInput.value) || 0;
  const maxPrice = parseFloat(filterMaxPriceInput.value) || Number.MAX_VALUE;

  const filteredListings = carListings.filter((listing) => {
    const carName = listing.car.name.toLowerCase();
    const carPrice = parseInt(listing.car.price, 10); // Parse the price as an integer
    const carPricePerDay = parseInt(listing.car.priceperday, 10); // Parse the priceperday as an integer

    return carName.includes(nameFilter) && (carPrice >= minPrice && carPrice <= maxPrice || carPricePerDay >= minPrice && carPricePerDay <= maxPrice);
  });

  renderCarListings(filteredListings);
}

// Function to reset the filter and display all listings
function resetFilter() {
  filterNameInput.value = "";
  filterMinPriceInput.value = "";
  filterMaxPriceInput.value = "";

  renderCarListings(carListings);
}

// Event listeners for filtering and resetting
applyFilterButton.addEventListener("click", applyFilter);
resetFilterButton.addEventListener("click", resetFilter);

// Function to update the form fields based on rental duration choice
function updateRentalDurationChoice() {
  const hoursOption = document.getElementById("hoursOption");
  const dayFields = document.getElementById("dayFields");
  const hourFields = document.getElementById("hourFields");
  const perhour = document.getElementById("perhour");
  const perday = document.getElementById("perday");

  if (hoursOption.checked) {
    hourFields.style.display = "block";
    dayFields.style.display = "none";
    perhour.style.display = "block";
    perday.style.display = "none";
  } 
  else {
    hourFields.style.display = "none";
    dayFields.style.display = "block";
    perhour.style.display = "none";
    perday.style.display = "block";
  }

  // Calculate and update the total price when the rental duration choice changes
  updateTotalPrice();
}

const rentalDurationOptions = document.querySelectorAll("input[name='rentalDuration']");
rentalDurationOptions.forEach((option) => {
  option.addEventListener("change", updateRentalDurationChoice);
});

// Event listener for input changes
document.getElementById("pickupTime").addEventListener("input", updateTotalPrice);
document.getElementById("returnTime").addEventListener("input", updateTotalPrice);
document.getElementById("pickupDateDay").addEventListener("change", updateTotalPrice);
document.getElementById("returnDate").addEventListener("change", updateTotalPrice);





// Function to update the number of days based on the selected pickup and return dates
function updateNumberOfDaysAndTotal() {
  const pickupDateInput = document.getElementById("pickupDateDay");
  const returnDateInput = document.getElementById("returnDate");
  const numberOfDaysInput = document.getElementById("numberOfDays");

  const pickupDate = new Date(pickupDateInput.value);
  const returnDate = new Date(returnDateInput.value);

  if (!isNaN(pickupDate.getTime()) && !isNaN(returnDate.getTime())) {
    const timeDifference = returnDate - pickupDate;
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    numberOfDaysInput.value = days;
    updateTotalPrice();
  } else {
    numberOfDaysInput.value = 0;
    updateTotalPrice();
  }
}

// Event listeners for input changes
document.getElementById("pickupDateDay").addEventListener("change", updateNumberOfDaysAndTotal);
document.getElementById("returnDate").addEventListener("change", updateNumberOfDaysAndTotal);


// Function to update the total price based on user input (hours or days)
function updateTotalPrice() {
  const hoursOption = document.getElementById("hoursOption");
  const pickupTimeInput = document.getElementById("pickupTime").value;
  const returnTimeInput = document.getElementById("returnTime").value;
  const pickupDateInput = document.getElementById("pickupDate").value;
  const returnDateInput = document.getElementById("returnDate").value;
  const numberOfHoursInput = document.getElementById("numberOfHours");
  const numberOfDaysInput = document.getElementById("numberOfDays");
  const totalAmountElementHour = document.getElementById("totalPricePerHour");
  const totalAmountElementDay = document.getElementById("totalPricePerDay");

  // Fetch car details
  const carDetails = fetchCarDetails(selectedCarId);

  if (hoursOption.checked && pickupTimeInput && returnTimeInput) {
    // Calculate total price based on hours
    const pickupTimeParts = pickupTimeInput.split(":");
    const returnTimeParts = returnTimeInput.split(":");
    const pickupHours = parseInt(pickupTimeParts[0]);
    const pickupMinutes = parseInt(pickupTimeParts[1]);
    const returnHours = parseInt(returnTimeParts[0]);
    const returnMinutes = parseInt(returnTimeParts[1]);

    const pickupDateTime = new Date();
    pickupDateTime.setHours(pickupHours, pickupMinutes, 0, 0);

    const returnDateTime = new Date();
    returnDateTime.setHours(returnHours, returnMinutes, 0, 0);

    if (!isNaN(pickupDateTime) && !isNaN(returnDateTime)) {
      const timeDifferenceMilliseconds = returnDateTime - pickupDateTime;
      const timeDifferenceHours = timeDifferenceMilliseconds / (1000 * 60 * 60);
      numberOfHoursInput.value = timeDifferenceHours.toFixed(2);

      const totalPrice = timeDifferenceHours * carDetails.carPrice;

      if (totalAmountElementHour && totalAmountElementDay) {
        totalAmountElementHour.textContent = `₦${totalPrice.toFixed(2)}`;
        totalAmountElementDay.textContent = ""; // Clear the total price per day
      }
    }
  } 
  else {
      // Calculate total price based on days
      const pickupDate = new Date(pickupDateInput);
      const returnDate = new Date(returnDateInput);
  
      if (!isNaN(pickupDate.getTime()) && !isNaN(returnDate.getTime())) {
        const timeDifferenceMilliseconds = returnDate - pickupDate;
        const timeDifferenceDays = timeDifferenceMilliseconds / (1000 * 60 * 60 * 24);
        numberOfDaysInput.value = timeDifferenceDays.toFixed(2);
  
        const totalPriceDays = timeDifferenceDays * carDetails.carPricePerDay;
  
        if (totalAmountElementDay && totalAmountElementHour) {
          totalAmountElementDay.textContent = `₦${totalPriceDays.toFixed(2)}`;
          totalAmountElementHour.textContent = ""; // Clear the total price per hour
        }
    }
  }
}

// 

// Event listener for input changes
document.getElementById("pickupTime").addEventListener("input", updateTotalPrice);
document.getElementById("returnTime").addEventListener("input", updateTotalPrice);
document.getElementById("pickupDate").addEventListener("change", updateTotalPrice);
document.getElementById("returnDate").addEventListener("change", updateTotalPrice);



// Update the form fields when the page loads
updateRentalDurationChoice();