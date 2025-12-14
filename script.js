document.addEventListener('DOMContentLoaded', () => {
    // Get Elements
    const rateInput = document.getElementById('rate');
    const targetInput = document.getElementById('target');
    const currentInput = document.getElementById('current');
    const calendarBtn = document.getElementById('calendar-btn');
    
    // Add Event Listeners
    if (rateInput) rateInput.addEventListener('input', calculateTime);
    if (targetInput) targetInput.addEventListener('input', calculateTime);
    if (currentInput) currentInput.addEventListener('input', calculateTime);
    if (calendarBtn) calendarBtn.addEventListener('click', addToCalendar);

    // Global variables for the calendar function
    let calculatedMinutes = 0;
    let remainingAmount = 0;

    function calculateTime() {
        const resultsContainer = document.getElementById('results-container');
        const updateIndicator = document.getElementById('update-indicator');
        
        const rate = parseFloat(rateInput.value);
        const target = parseFloat(targetInput.value);
        const current = parseFloat(currentInput.value) || 0;

        // 1. Validation: Ensure Rate and Target are positive numbers
        if (!rate || !target || rate <= 0 || target <= 0) {
            resultsContainer.classList.add('opacity-50');
            resultsContainer.classList.remove('opacity-100');
            
            // Disable button if inputs are invalid
            calendarBtn.disabled = true;
            calendarBtn.classList.add('opacity-50', 'cursor-not-allowed');
            
            // Reset text
            document.getElementById('formatted-time').innerHTML = '-- <span class="text-sm text-slate-500">HR</span> -- <span class="text-sm text-slate-500">MIN</span>';
            document.getElementById('total-minutes').innerText = '0';
            document.getElementById('completion-time').innerText = '--:--';
            
            updateIndicator.innerText = "WAITING FOR INPUT...";
            return;
        }

        // 2. Logic: Calculate
        remainingAmount = target - current;
        
        // If you already have enough currency, set remaining to 0
        if (remainingAmount <= 0) {
            remainingAmount = 0;
            calculatedMinutes = 0;
        } else {
            calculatedMinutes = remainingAmount / rate;
        }

        // 3. UI Updates
        resultsContainer.classList.remove('opacity-50');
        resultsContainer.classList.add('opacity-100');
        updateIndicator.innerText = "CALCULATING...";
        updateIndicator.classList.add('text-blue-400');

        // Button State Logic: Only enable if there is actual time to grind (> 0 minutes)
        if (calculatedMinutes > 0) {
            calendarBtn.disabled = false;
            calendarBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            calendarBtn.disabled = true;
            calendarBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Format Output
        const hours = Math.floor(calculatedMinutes / 60);
        const minutes = Math.floor(calculatedMinutes % 60);
        const seconds = Math.floor((calculatedMinutes * 60) % 60);

        let timeString = '';
        if (hours > 0) timeString += `${hours} <span class="text-sm text-slate-500">HR</span> `;
        timeString += `${minutes} <span class="text-sm text-slate-500">MIN</span>`;
        
        if (hours === 0 && minutes === 0) {
            if (calculatedMinutes > 0) {
                // Less than 1 minute but more than 0
                timeString = `${seconds} <span class="text-sm text-slate-500">SEC</span>`;
            } else {
                // Done
                timeString = `<span class="text-emerald-400">DONE</span>`;
            }
        }

        document.getElementById('formatted-time').innerHTML = timeString;
        document.getElementById('total-minutes').innerText = calculatedMinutes.toFixed(1);

        // Completion Time
        const now = new Date();
        const finishTime = new Date(now.getTime() + calculatedMinutes * 60000);
        const timeOptions = { hour: 'numeric', minute: '2-digit' };
        document.getElementById('completion-time').innerText = finishTime.toLocaleTimeString([], timeOptions);

        setTimeout(() => {
            updateIndicator.innerText = "UPDATED";
            updateIndicator.classList.remove('text-blue-400');
        }, 500);
    }

    function addToCalendar() {
        if (calculatedMinutes <= 0) return;

        const now = new Date();
        // Calculate the exact time the grind finishes
        const finishTime = new Date(now.getTime() + calculatedMinutes * 60000);

        // Helper to format date for Google Calendar (UTC format: YYYYMMDDTHHmmssZ)
        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        // We use the finishTime for BOTH start and end to create a "Point in time" reminder
        const finishStr = formatDate(finishTime);
        
        const title = `Grind Complete: ${remainingAmount.toLocaleString()} Currency`;
        const rateVal = document.getElementById('rate').value;
        const details = `Goal: Farm ${remainingAmount.toLocaleString()} currency.\nRate: ${rateVal}/min.\nTotal Duration: ${Math.ceil(calculatedMinutes)} minutes.`;
        
        // Generate Link with same start and end time
        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${finishStr}/${finishStr}&details=${encodeURIComponent(details)}&sf=true&output=xml`;

        window.open(googleCalUrl, '_blank');
    }
});
