let date = localStorage.getItem('date');
let time = localStorage.getItem('time');
let duration = localStorage.getItem('duration');
let total = localStorage.getItem('total');

document.getElementById('table-date').textContent = date;
document.getElementById('table-time').textContent = time;
document.getElementById('table-duration').textContent = duration;
document.getElementById('table-total').textContent = total;

const toCamelCase = (string) => {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i === 0) {
        words[i] = words[i].toUpperCase();
      } else {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }
  
    return words.join(' ');
  };

// get category data from local storage
let guestCategories = ['sl-adult', 'sl-child', 'foreigner-adult', 'foreigner-child','infant']; // Add all your categories here
for (let i = 0; i < guestCategories.length; i++) {
  let categoryData = localStorage.getItem('category-' + guestCategories[i]);
  if (categoryData) {
    let tableCategory = document.getElementById('table-' + guestCategories[i] + '-category');
    let tableCategoryTotal = document.getElementById('table-' + guestCategories[i]);
    let [countAndCategory, totalForCategory] = categoryData.split(' | ');

    // Get the count from the countAndCategory string
    let count = parseInt(countAndCategory.split(' ')[0]);

    // If the count is 0, hide the row, else show the row and set the text content
    if (count === 0) {
      tableCategory.parentNode.style.display = 'none';
    } else {
      tableCategory.parentNode.style.display = 'table-row';
      tableCategory.textContent = toCamelCase(countAndCategory.replace('-', ' '));
      tableCategoryTotal.textContent = totalForCategory;
    }
  }
}

$(document).ready(function() {
  // Initialize the intlTelInput
  var input = document.querySelector("#mobile_code");
  window.intlTelInput(input, {
      initialCountry: "lk",
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
  });

  // Form validation
  $('.my-form input, .my-form select').on('change keyup', function() {
      var name = $('input[name="name"]');
      var gender = $('#gender');
      var phone = $('input[name="phone"]');
      var email = $('input[name="email"]');
      var confirmEmail = $('input[name="confirm-email"]');

      // Reset error messages and styles
      $('.form-data .error').text('');
      $('.my-form input, .my-form select').css('border-color', '');



      // Check if all fields are filled and email fields match
      if (name.val() && gender.val() && phone.val() && email.val() && confirmEmail.val() && email.val() === confirmEmail.val()) {
          // Additional validation for phone number and email
          // Reset error messages and styles
        phone.next('.error').text('');
        email.next('.error').text('');
        phone.css('border-color', '');
        email.css('border-color', '');

          var phoneRegex = /^\d{9}$/;
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


          if (!phoneRegex.test(phone.val())) {
            phone.closest('.form-data').find('.error').text('Phone number must be 9 digits.');
            phone.css('border-color', 'red');
        }

        if (!emailRegex.test(email.val())) {
          email.siblings('.error').text('Invalid email format.');
            email.css('border-color', 'red');
        }else {
              $('#continue-purchase').prop('disabled', false);

              // Store values in local storage
              localStorage.setItem('name', name.val());
              localStorage.setItem('gender', gender.val());
              localStorage.setItem('phone', phone.val());
              localStorage.setItem('email', email.val());
          }
      } else {
          $('#continue-purchase').prop('disabled', true);

          // Check each field and display error messages
          if (!name.val()) {
              name.next('.error').text('Please enter your name.');
              name.css('border-color', 'red');
          }
          if (!gender.val()) {
            gender.parent().find('.error').text('Please select your gender.');
              gender.css('border-color', 'red');
          }
          if (!phone.val()) {
            phone.closest('.form-data').find('.error').text('Please enter your phone number.');
              phone.css('border-color', 'red');
          }
          if (!email.val()) {
              email.next('.error').text('Please enter your email.');
              email.css('border-color', 'red');
          }
          if (!confirmEmail.val()) {
              confirmEmail.next('.error').text('Please confirm your email.');
              confirmEmail.css('border-color', 'red');
          }
          if (email.val() !== confirmEmail.val()) {
              confirmEmail.next('.error').text('Emails do not match.');
              confirmEmail.css('border-color', 'red');
          }
      }
  });
});
