const meetings = ["10/10/2025", "10/15/2025", "10/20/2025"];
const yesMeeting = "There is meeting today";
const noMeeting = "There is no meeting today";

const currentDate = new Date();

function renderCalendar() {
  const monthYear = document.getElementById('monthYear');
  const calendarGrid = document.getElementById('calendarGrid');

  const displayYear = currentDate.getFullYear();
  const displayMonth = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  calendarGrid.innerHTML = '';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });

  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-date empty';
    calendarGrid.appendChild(emptyCell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateCell = document.createElement('div');
    dateCell.className = 'calendar-date';
    dateCell.textContent = d;

    const cellDate = `${displayMonth + 1}/${d}/${displayYear}`;
    if (meetings.includes(cellDate)) {
      dateCell.classList.add('selected');
    }

    dateCell.onclick = () => {
      const clickedDate = `${displayMonth + 1}/${d}/${displayYear}`;
      const meetingStatus = document.getElementById('meetingStatus');

      if (meetings.includes(clickedDate)) {
        meetingStatus.textContent = `${clickedDate} - ${yesMeeting}`;
      } else {
        meetingStatus.textContent = `${clickedDate} - ${noMeeting}`;
      }
    };

    calendarGrid.appendChild(dateCell);
  }
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
