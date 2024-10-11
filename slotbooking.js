document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const calendarGrid = document.getElementById('calendar-grid');
    const selectedDetails = document.getElementById('selected-details');
    const timeSlot = document.getElementById('time-slot'); // Time slot selection
    let selectedDate = null;

    // NGO names based on type
    const ngoNames = {
        children: ['Vatsalya Trust', 'Baalanand', 'Catalyst for Social Action', 'Prerna', 'Shraddhanand Organization'],
        elderly: ['Adharwad Trust', 'ADAPT-Able Disable All People Together', 'Kamla Mehta Donar Blind School'],
        'differently-abled': ['Prerna', 'Moneylife Foundation', 'HelpAge India', 'Silver Innings Foundation']
    };

    // Populate NGO names based on the selected NGO type
    const ngoType = document.getElementById('ngo-type');
    const ngoName = document.getElementById('ngo-name');

    function updateNgoNames() {
        const selectedType = ngoType.value;
        ngoName.innerHTML = ''; // Clear previous options

        ngoNames[selectedType].forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            ngoName.appendChild(option);
        });
    }

    // Add event listener for NGO type change
    ngoType.addEventListener('change', updateNgoNames);

    // Call the function initially to set the correct NGO names on page load
    updateNgoNames();

    // Populate month and year select options
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < months.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = months[i];
        monthSelect.appendChild(option);
    }

    for (let i = 2024; i <= 2050; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set current month and year
    monthSelect.value = new Date().getMonth();
    yearSelect.value = new Date().getFullYear();

    // Generate calendar with day headers
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = ''; // Clear previous grid

        // Create day headers
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day-header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        // Create empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-empty-cell');
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
        const selectedNgoType = ngoType.value;
        const selectedNgoName = ngoName.value;
        const selectedTimeSlot = timeSlot.options[timeSlot.selectedIndex].textContent; // Get time slot value
        const dayOfWeek = new Date(year, month, day).toLocaleString('en-US', { weekday: 'long' });
        selectedDetails.innerHTML = `
            <p><strong>NGO Type:</strong> ${selectedNgoType}</p>
            <p><strong>NGO Name:</strong> ${selectedNgoName}</p>
            <p><strong>Selected Date:</strong> ${dayOfWeek}, ${day} ${months[month]}, ${year}</p>
            <p><strong>Selected Time Slot:</strong> ${selectedTimeSlot}</p>
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
