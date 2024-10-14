document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const calendarGrid = document.getElementById('calendar-grid');
    const selectedDetails = document.getElementById('selected-details');
    const timeSlotSelect = document.getElementById('time-slot');
    let selectedDate = null;

    const ngoNames = {
        children: ['Vatsalya Trust', 'Baalanand', 'Catalyst for Social Action', 'Prerna', 'Shraddhanand Organization'],
        elderly: ['Adharwad Trust', 'ADAPT-Able Disable All People Together', 'Kamla Mehta Donar Blind School'],
        'differently-abled': ['Prerna', 'Moneylife Foundation', 'HelpAge India', 'Silver Innings Foundation']
    };

    const ngoType = document.getElementById('ngo-type');
    const ngoName = document.getElementById('ngo-name');

    // Update NGO names based on selected type
    function updateNgoNames() {
        const selectedType = ngoType.value;
        ngoName.innerHTML = '';
        ngoNames[selectedType].forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            ngoName.appendChild(option);
        });
    }

    ngoType.addEventListener('change', updateNgoNames);
    updateNgoNames();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentYear = new Date().getFullYear();

    // Populate month and year select options
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

    // Set default to current month and year
    monthSelect.value = new Date().getMonth();
    yearSelect.value = new Date().getFullYear();

    // Handle date selection
    function handleDateClick(dayCell, bookedDates, dateStr, day, month, year) {
        if (selectedDate) {
            selectedDate.classList.remove('selected');
        }
        if (!bookedDates.includes(dateStr)) {
            dayCell.classList.add('selected');
            selectedDate = dayCell;
            updateSelectedDetails(day, month, year);
        }
    }

    // Generate the calendar for the selected month and year
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = '';

        // Add day headers
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day-header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        // Fetch booked dates from the server
        fetch('http://localhost/pblproject/php/get_booked_dates.php')
            .then(response => response.json())
            .then(bookedDates => {
                for (let i = 0; i < firstDay; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.classList.add('calendar-empty-cell');
                    calendarGrid.appendChild(emptyCell);
                }

                // Create calendar days
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayCell = document.createElement('div');
                    dayCell.classList.add('calendar-day');
                    dayCell.textContent = day;

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    if (bookedDates.includes(dateStr)) {
                        dayCell.classList.add('booked');
                        dayCell.style.color = 'red';
                    } else {
                        dayCell.style.color = 'black';
                        dayCell.addEventListener('click', function () {
                            handleDateClick(dayCell, bookedDates, dateStr, day, month, year);
                        });
                    }

                    calendarGrid.appendChild(dayCell);
                }
            })
            .catch(error => {
                console.error("Error fetching booked dates:", error);
            });
    }

    // Update the selected details section
    function updateSelectedDetails(day, month, year) {
        const selectedNgoType = ngoType.value;
        const selectedNgoName = ngoName.value;
        const selectedTimeSlot = timeSlotSelect.value;
        const dayOfWeek = new Date(year, month, day).toLocaleString('en-US', { weekday: 'long' });
        selectedDetails.innerHTML = `
            <p><strong>NGO Type:</strong> ${selectedNgoType}</p>
            <p><strong>NGO Name:</strong> ${selectedNgoName}</p>
            <p><strong>Selected Date:</strong> ${dayOfWeek}, ${day} ${months[month]}, ${year}</p>
            <p><strong>Time Slot:</strong> ${selectedTimeSlot.charAt(0).toUpperCase() + selectedTimeSlot.slice(1)}</p>
        `;
    }

    // Initial calendar generation
    generateCalendar(monthSelect.value, yearSelect.value);

    // Update calendar when month or year changes
    monthSelect.addEventListener('change', function () {
        generateCalendar(monthSelect.value, yearSelect.value);
    });

    yearSelect.addEventListener('change', function () {
        generateCalendar(monthSelect.value, yearSelect.value);
    });

    // Handle the booking confirmation
    document.getElementById('enter-btn').addEventListener('click', function () {
        if (selectedDate) {
            const selectedNgoType = ngoType.value;
            const selectedNgoName = ngoName.value;
            const selectedTimeSlot = timeSlotSelect.value;  // Get the selected time slot

            const selectedDay = selectedDate.textContent;
            const selectedMonth = parseInt(monthSelect.value) + 1;
            const selectedYear = yearSelect.value;

            const bookingDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

            // Include time slot in booking data
            const bookingData = new URLSearchParams({
                ngo_type: selectedNgoType,
                ngo_name: selectedNgoName,
                booking_date: bookingDate,
                timeslot: selectedTimeSlot  // Add time slot here
            });

            fetch('http://localhost/pblproject/php/book.php', {
                method: 'POST',
                body: bookingData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert("Booking confirmed! " + data.message);

                    selectedDate.classList.add('booked');
                    selectedDate.style.color = 'red';
                    selectedDate.removeEventListener('click', handleDateClick); // Disable future clicks on this date
                    
                    generateCalendar(monthSelect.value, yearSelect.value);
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
        } else {
            alert("Please select a date before proceeding.");
        }
    });
});