const calContainer = document.querySelector('.cal-container');
const headerDate = document.querySelector('.cal-header-date');
const daysContainer = document.querySelector('.grid-days');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const todayBtn = document.querySelector('.today-btn');
const gotoBtn = document.querySelector('.goto-btn');
const dateInput = document.querySelector('.date-input');

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export { initCalendar };

// Function to add days to the calendar
function initCalendar() {
  // Initial data to get previous month days, all current month days and next month days
  const firstDay = new Date(year, month, 1); // => Wed Feb 01 2023 00:00:00 GMT+0100 (hora estándar de Europa central)
  const lastDay = new Date(year, month + 1, 0); // => Tue Feb 28 2023 00:00:00 GMT+0100 (hora estándar de Europa central)
  const prevFirstDay = new Date(year, month, 0); // => Tue Jan 31 2023 00:00:00 GMT+0100 (hora estándar de Europa central)
  const prevFirstDate = prevFirstDay.getDate(); // => 31
  const lastDate = lastDay.getDate(); // => 28
  const weekDay = firstDay.getDay(); // => 3 (Wednesday)
  const nextMonthDays = 7 - lastDay.getDay() - 1; // => 4

  // Update cal-header date
  headerDate.innerHTML = months[month] + ' ' + year;

  // Add days on DOM
  let daysDOM = '';
  let week = 1;
  let daysCounter = 0;

  daysContainer.innerHTML = '';
  daysContainer.innerHTML += `<tr class="grid-week grid-week-${week}" role="rowgroup">
                              </tr>`;

  // Days of previous month (if necessary)
  for (let i = weekDay; i > 0; i--) {
    daysDOM = `<td class="grid-day prev-date">
                <div class="grid-day-frame">
                  <div class="grid-day-header">${prevFirstDate - i + 1}</div>
                  <div class="grid-day-body"></div>
                </div>
              </td>`;
    daysCounter++;
    document.querySelector(`.grid-week-${week}`).innerHTML += daysDOM;
  }

  // Days of current month
  for (let i = 1; i <= lastDate; i++) {
    if (daysCounter < 7) {
      // If it is today, add class .today
      if (
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
      ) {
        daysDOM = `<td class="grid-day today">
                  <div class="grid-day-frame">
                    <div class="grid-day-header">${i}</div>
                    <div class="grid-day-body"></div>
                  </div>
                </td>`;
        daysCounter++;
        document.querySelector(`.grid-week-${week}`).innerHTML += daysDOM;
      } else {
        // All the other days
        daysDOM = `<td class="grid-day">
                    <div class="grid-day-frame">
                      <div class="grid-day-header">${i}</div>
                      <div class="grid-day-body"></div>
                    </div>
                  </td>`;
        daysCounter++;
        document.querySelector(`.grid-week-${week}`).innerHTML += daysDOM;
      }
    } else if (daysCounter === 7) {
      daysCounter = 0;
      i--;
      week++;
      daysContainer.innerHTML += `<tr class="grid-week grid-week-${week}" role="rowgroup">
                                  </tr>`;
    }
  }

  // Days of next month (if necessary)
  for (let j = 1; j <= nextMonthDays; j++) {
    daysDOM = `<td class="grid-day next-date">
                <div class="grid-day-frame">
                  <div class="grid-day-header">${j}</div>
                  <div class="grid-day-body"></div>
                </div>
              </td>`;
    daysCounter++;
    document.querySelector(`.grid-week-${week}`).innerHTML += daysDOM;
  }
}

// Previous month button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}
prev.addEventListener('click', prevMonth);

// Next month button
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}
next.addEventListener('click', nextMonth);

// 'Today' button
todayBtn.addEventListener('click', () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

// Date input functionallity
dateInput.addEventListener('input', e => {
  // Allow only numbers and remove anything else
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, '');
  // add an slash when two numbers entered
  if (dateInput.value.length === 2) {
    dateInput.value += '/';
  }
  // don't allow more than 7 characters
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  // when backspace pressed
  if (e.inputType === 'deleteContentBackward') {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
    // BUG
    // Once fourth character is deleted and slash disappears, numbers can be entered without slash
  }
});

// 'Go-to' button
gotoBtn.addEventListener('click', gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split('/');
  // data validation
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  // invalid date
  // alert('Invalid date');
  Swal.fire({
    title: 'Invalid date',
    text: 'Please enter date with format mm/yyyy',
    icon: 'warning',
    width: '20rem',
    color: '#2b4865',
    position: 'top',
  });
}
