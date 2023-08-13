let date = localStorage.getItem('date');
let time = localStorage.getItem('time');
let duration = localStorage.getItem('duration');
let total = localStorage.getItem('total');
let name1 = localStorage.getItem('name');
let phone = localStorage.getItem('phone');
let email = localStorage.getItem('email');
let gender = localStorage.getItem('gender');

document.getElementById('table-date').textContent = date;
document.getElementById('table-time').textContent = time;
document.getElementById('table-duration').textContent = duration;
document.getElementById('table-total').textContent = total;
document.getElementById('table-username').textContent = name1;
document.getElementById('table-mobile').textContent = phone;
document.getElementById('table-email').textContent = email;
document.getElementById('table-gender').textContent = gender;

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