
import * as http from "http";
import { parse } from "url";

const port = 3000;
const hostname = "0.0.0.0";

const yesmeeting="There is meeting today";//message when meeting is there
const nomeeting="There is no meeting today";//message when meeting isn't there
let meetings: string[] = ["10/10/2025", "10/15/2025", "10/20/2025"];
//list of dates in MM/DD/YYYY format
const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url || "", true);

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meeting Date Tracker</title>
          <style>
            * {
              transition: all 0.3s ease;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 650px;
              margin: 40px auto;
              padding: 30px;
              background: linear-gradient(135deg, #f5f5f5 0%, #c8e6c9 100%);
              min-height: 100vh;
            }
            
            h1 {
              color: #1b5e20;
              text-align: center;
              margin-bottom: 40px;
              font-size: 2.5em;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            
            .meeting-info {
              background: white;
              padding: 30px;
              border-radius: 12px;
              margin-top: 30px;
              box-shadow: 0 4px 6px rgba(27, 94, 32, 0.15);
              border: 2px solid #2e7d32;
            }
            
            .meeting-info h2 {
              color: #1b5e20;
              margin-top: 0;
            }
            
            .meeting-info h3 {
              color: #2e7d32;
            }
            
            .meeting-info ul {
              list-style: none;
              padding: 0;
            }
            
            .meeting-info li {
              background: #c8e6c9;
              padding: 10px;
              margin: 8px 0;
              border-radius: 6px;
              border-left: 4px solid #2e7d32;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .meeting-info li:hover {
              transform: translateX(5px);
              box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
            }
            
            .calendar {
              background: white;
              border: 2px solid #2e7d32;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 30px;
              box-shadow: 0 4px 6px rgba(27, 94, 32, 0.15);
            }
            
            .calendar-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 25px;
            }
            
            .calendar-header span {
              color: #1b5e20;
              font-size: 1.3em;
              font-weight: 600;
            }
            
            .calendar-header button {
              background: #2e7d32;
              color: white;
              border: none;
              padding: 8px 15px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              box-shadow: 0 2px 4px rgba(46, 125, 50, 0.4);
            }
            
            .calendar-header button:hover {
              background: #1b5e20;
              transform: scale(1.05);
              box-shadow: 0 4px 8px rgba(46, 125, 50, 0.5);
            }
            
            .calendar-grid {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 10px;
            }
            
            .calendar-day {
              text-align: center;
              padding: 12px;
              font-weight: bold;
              font-size: 13px;
              color: #1b5e20;
              margin-bottom: 5px;
            }
            
            .calendar-date {
              text-align: center;
              padding: 14px;
              border-radius: 8px;
              cursor: pointer;
              background: #e8f5e9;
              color: #1b5e20;
              font-weight: 500;
            }
            
            .calendar-date:hover {
              background: #a5d6a7;
              transform: scale(1.1);
              box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
            }
            
            .calendar-date.selected {
              background: #2e7d32;
              color: white;
              font-weight: bold;
              box-shadow: 0 4px 8px rgba(46, 125, 50, 0.5);
            }
            
            .calendar-date.selected:hover {
              background: #1b5e20;
            }
            
            .calendar-date.empty {
              background: transparent;
              cursor: default;
            }
            
            .calendar-date.empty:hover {
              transform: none;
              box-shadow: none;
            }
            
            input[type="date"] {
              padding: 10px;
              font-size: 16px;
              margin-right: 10px;
              border: 2px solid #2e7d32;
              border-radius: 8px;
              background: white;
            }
            
            button {
              padding: 10px 24px;
              font-size: 16px;
              background: #2e7d32;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(46, 125, 50, 0.4);
            }
            
            button:hover {
              background: #1b5e20;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(46, 125, 50, 0.5);
            }
          </style>
        </head>
        <body>
          <h1>Next Meeting Date</h1>

          <div class="calendar" id="calendar">
            <div class="calendar-header">
              <button onclick="previousMonth()">◀</button>
              <span id="monthYear"></span>
              <button onclick="nextMonth()">▶</button>
            </div>
            <div class="calendar-grid" id="calendarGrid"></div>
          </div>

          <div class="meeting-info">
            <h2 id="meetingStatus">Click a date to check for meetings</h2>
          </div>

          <script>
            const meetings = ${JSON.stringify(meetings)};
            const currentDate = new Date();

            function renderCalendar() {
              const monthYear = document.getElementById('monthYear');
              const calendarGrid = document.getElementById('calendarGrid');

              const displayYear = currentDate.getFullYear();
              const displayMonth = currentDate.getMonth();

              monthYear.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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

                const cellDate = \`\${displayMonth + 1}/\${d}/\${displayYear}\`;
                if (meetings.includes(cellDate)) {
                  dateCell.classList.add('selected');
                }

                dateCell.onclick = () => {
                  const clickedDate = \`\${displayMonth + 1}/\${d}/\${displayYear}\`;
                  const meetingStatus = document.getElementById('meetingStatus');

                  if (meetings.includes(clickedDate)) {
                    meetingStatus.textContent = \`\${clickedDate} - ${yesmeeting}\`;
                  } else {
                    meetingStatus.textContent = \`\${clickedDate} - ${nomeeting}\`;
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
          </script>
        </body>
      </html>
    `);
  } else if (parsedUrl.pathname === "/update") {
    const newDate = parsedUrl.query.date;
    if (newDate && typeof newDate === "string" && !meetings.includes(newDate)) {
      meetings.push(newDate);
      meetings.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });
    }
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
