window.onload = function() {
  // Initialize date picker with today's date
  localStorage.clear();
  let datePicker = document.getElementById('visit-date');
  datePicker.valueAsDate = new Date();

  // Set min date to today
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  datePicker.setAttribute("min", today);

  flatpickr("#visit-date", {
    defaultDate: "today",
    inline: true // This makes the date picker always open
});

  // Update table when date is changed
  datePicker.addEventListener('change', function() {
    updateTable();
  });
  // Initialize time picker
  let startTimePicker = document.getElementById('start-time');
  let endTimePicker = document.getElementById('end-time');
  endTimePicker.disabled = true;
/*
  startTimePicker.addEventListener('change', function() {
    endTimePicker.disabled = false;
    let startTime = convertTimeTo24Hour(startTimePicker.value);
    for (let i = 0; i < endTimePicker.options.length; i++) {
      let endTime = convertTimeTo24Hour(endTimePicker.options[i].value);
      if (endTime <= startTime) {
        endTimePicker.options[i].disabled = true;
      } else {
        endTimePicker.options[i].disabled = false;
      }
    }
    updateTable();
  });
*/

startTimePicker.addEventListener('change', function() {
  let endTimeSelect = document.getElementById('end-time');
  let endTimeOptions = endTimeSelect.options;
  let startTimeIndex = this.selectedIndex;
  endTimePicker.disabled = false;

   // Set the end time to be one hour later than the start time
  if (startTimeIndex < endTimeOptions.length - 1) {
    endTimeSelect.selectedIndex = startTimeIndex + 1;
  } else {
    endTimeSelect.selectedIndex = startTimeIndex;
  }

  // Disable end time options that are earlier than the start time
  for (let i = 0; i < endTimeOptions.length; i++) {
    endTimeOptions[i].disabled = i < startTimeIndex;
  }

  updateTable();
});


  endTimePicker.addEventListener('change', function() {
    updateTable();
  });

  // Initialize guest count
  let incrementButtons = document.getElementsByClassName('increment');
  let decrementButtons = document.getElementsByClassName('decrement');

  for (let i = 0; i < incrementButtons.length; i++) {
    incrementButtons[i].addEventListener('click', function() {
      let category = this.getAttribute('data-category');
      let countSpan = document.getElementById('count-' + category);
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
      updateTable();
    });

    decrementButtons[i].addEventListener('click', function() {
      let category = this.getAttribute('data-category');
      let countSpan = document.getElementById('count-' + category);
      if (parseInt(countSpan.textContent) > 0) {
        countSpan.textContent = parseInt(countSpan.textContent) - 1;
      }
      updateTable();
    });
  }

  // Update table initially
  updateTable();
}

function updateTable() {
  let guestCategories = document.getElementsByClassName('guest-category');
  let total = 0;
  let totalTickets = 0;

  // Update date and time in the table
  let date = document.getElementById('visit-date').value;
  let startTime = document.getElementById('start-time').value;
  let endTime = document.getElementById('end-time').value;
  
  // Convert 12-hour format to 24-hour format
  let startHour = convertTo24Hour(startTime);
  let endHour = convertTo24Hour(endTime);

  // Calculate duration
  let startDate = new Date(`01/01/2022 ${startHour}:00`);
  let endDate = new Date(`01/01/2022 ${endHour}:00`);
  let duration = (endDate - startDate) / (1000 * 60 * 60); // convert milliseconds to hours

  let peakHours = 0;
  let currentTime = new Date(startDate.getTime());

  while (currentTime < endDate) {
    let currentHour = currentTime.getHours();
    if ((currentHour >= 10 && currentHour < 13) || (currentHour >= 15 && currentHour < 18)) {
      peakHours++;
    }
    currentTime.setHours(currentTime.getHours() + 1);
  }

  let normalHours = duration - peakHours;

  
  

  for (let i = 0; i < guestCategories.length; i++) {
    let category = guestCategories[i].getElementsByTagName('label')[0].htmlFor;
    let count = guestCategories[i].getElementsByClassName('count')[0].textContent;
    

    let totalForCategory = calculateTotalForCategory(category, count, normalHours, peakHours);
      // Store all category data in localStorage, regardless of the count
       localStorage.setItem('category-' + category, count + ' ' + category + ' | $' + totalForCategory);


    if (count > 0) {
      document.getElementById('table-' + category + '-category').parentNode.style.display = 'table-row';
      document.getElementById('table-' + category + '-category').textContent = count + ' ' + toCamelCase(category);
      document.getElementById('table-' + category).textContent = '$' + totalForCategory;
      totalTickets += parseInt(count);
      //let categoryData = count + ' ' + category.replace('-', ' ') + ' | $' + totalForCategory;
      //localStorage.setItem('category-' + category, categoryData);
    } else {
      document.getElementById('table-' + category + '-category').parentNode.style.display = 'none';
    }

    total += totalForCategory;
  }

  document.getElementById('table-date').textContent = date;
  document.getElementById('table-time').textContent = startTime + ' to ' + endTime;
  document.getElementById('table-duration').textContent = duration + ' hrs (' + normalHours + ' Normal : ' + peakHours + ' Peak)';
  document.getElementById('table-total').textContent = '$' + total;
 // document.getElementById('table-total-tickets').textContent = totalTickets;

 let continuePurchaseButton = document.getElementById('continue-purchase');

if (date && totalTickets > 0 && duration > 0) {
  continuePurchaseButton.disabled = false;
} else {
  continuePurchaseButton.disabled = true;
}


localStorage.setItem('date', date);
localStorage.setItem('time', startTime + ' to ' + endTime);
localStorage.setItem('duration', duration + ' hrs (' + normalHours + ' Normal : ' + peakHours + ' Peak)');
localStorage.setItem('total', '$' + total);
}


function convertTo24Hour(time) {
  let [hours, minutes] = time.split(':');
  hours = hours % 12;
  if (time.indexOf('pm') != -1) hours = Number(hours) + 12;
  return hours + ':' + minutes.split(' ')[0];
}


function calculateDuration(startTime, endTime) {
  let start = parseInt(startTime.split(':')[0]);
  let end = parseInt(endTime.split(':')[0]);
  
  if (endTime.includes('pm') && end != 12) {
    end += 12;
  }
  
  if (startTime.includes('pm') && start != 12) {
    start += 12;
  }
  
  return end - start;
}

const
toCamelCase = (string) => {
  const words = string.split("-");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
};



function getPrice(category) {
  let prices = {
    'sl-adult': 4,
    'sl-child': 2,
    'foreigner-adult': 10,
    'foreigner-child': 5,
    'infant': 0
  };

  return prices[category];
}

function convertTimeTo24Hour(time) {
  let [hours, minutes] = time.split(':');
  let period = minutes.slice(-2);
  minutes = minutes.slice(0, -2);

  if (period === 'pm' && hours !== '12') {
    hours = parseInt(hours) + 12;
  } else if (period === 'am' && hours === '12') {
    hours = '00';
  }

  return parseInt(hours + minutes);
}

function calculateTotalForCategory(category, count, normalHours, peakHours) {
  let normalPrice;
  let peakPrice;

  switch (category) {
    case 'sl-adult':
      normalPrice = 4;
      peakPrice = 6;
      break;
    case 'sl-child':
      normalPrice = 2;
      peakPrice = 3;
      break;
    case 'foreigner-adult':
      normalPrice = 10;
      peakPrice = 13;
      break;
    case 'foreigner-child':
      normalPrice = 5;
      peakPrice = 8;
      break;
    default:
      normalPrice = 0;
      peakPrice = 0;
  }

  return count * (normalHours * normalPrice + peakHours * peakPrice);
}





