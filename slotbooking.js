document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const calendarGrid = document.getElementById('calendar-grid');
    const selectedDetails = document.getElementById('selected-details');
    let selectedDate = null;

    // Populate month and year select options
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < months.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = months[i];
        monthSelect.appendChild(option);
    }

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set current month and year
    monthSelect.value = new Date().getMonth();
    yearSelect.value = new Date().getFullYear();

    // Generate calendar
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = ''; // Clear previous grid
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;
            dayCell.addEventListener('click', function () {
                if (selectedDate) {
                    selectedDate.classList.remove('selected');
                }
                dayCell.classList.add('selected');
                selectedDate = dayCell;
                updateSelectedDetails(day, month, year);
            });
            calendarGrid.appendChild(dayCell);
        }
    }

    // Update selected details
    function updateSelectedDetails(day, month, year) {
        const ngoType = document.getElementById('ngo-type').value;
        const ngoName = document.getElementById('ngo-name').value;
        selectedDetails.innerHTML = `
            <p><strong>NGO Type:</strong> ${ngoType}</p>
            <p><strong>NGO Name:</strong> ${ngoName}</p>
            <p><strong>Selected Date:</strong> ${day} ${months[month]}, ${year}</p>
        `;
    }

    // Initial calendar generation
    generateCalendar(monthSelect.value, yearSelect.value);

    // Update calendar on month/year change
    monthSelect.addEventListener('change', function () {
        generateCalendar(monthSelect.value, yearSelect.value);
    });

    yearSelect.addEventListener('change', function () {
        generateCalendar(monthSelect.value, yearSelect.value);
    });

    // Enter button click
    document.getElementById('enter-btn').addEventListener('click', function () {
        if (selectedDate) {
            alert("Booking confirmed with selected options.");
        } else {
            alert("Please select a date before proceeding.");
        }
    });
});
