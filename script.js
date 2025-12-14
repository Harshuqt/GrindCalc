// Event Listeners
document.getElementById('rate').addEventListener('input', calculateTime);
document.getElementById('target').addEventListener('input', calculateTime);
document.getElementById('current').addEventListener('input', calculateTime);

function calculateTime() {
    const rateInput = document.getElementById('rate');
    const targetInput = document.getElementById('target');
    const currentInput = document.getElementById('current');
    const resultsContainer = document.getElementById('results-container');
    const updateIndicator = document.getElementById('update-indicator');

    const rate = parseFloat(rateInput.value);
    const target = parseFloat(targetInput.value);
    const current = parseFloat(currentInput.value) || 0;

    // Basic validation
    if (!rate || !target || rate <= 0 || target <= 0) {
        resultsContainer.classList.add('opacity-50');
        resultsContainer.classList.remove('opacity-100');
        
        document.getElementById('formatted-time').innerHTML = '-- <span class="text-sm text-slate-500">HR</span> -- <span class="text-sm text-slate-500">MIN</span>';
        document.getElementById('total-minutes').innerText = '0';
        document.getElementById('completion-time').innerText = '--:--';
        
        updateIndicator.innerText = "WAITING FOR INPUT...";
        return;
    }

    // Calculation
    resultsContainer.classList.remove('opacity-50');
    resultsContainer.classList.add('opacity-100');
    updateIndicator.innerText = "CALCULATING...";
    updateIndicator.classList.add('text-blue-400');

    // Calculate Remaining
    let remaining = target - current;
    if (remaining < 0) remaining = 0;

    // Total minutes needed
    const totalMinutes = remaining / rate;
    
    // Format Hours and Minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60); // Optional precision

    // Update UI
    
    // Main Display
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} <span class="text-sm text-slate-500">HR</span> `;
    }
    timeString += `${minutes} <span class="text-sm text-slate-500">MIN</span>`;
    
    // If less than a minute
    if (hours === 0 && minutes === 0) {
        timeString = `${seconds} <span class="text-sm text-slate-500">SEC</span>`;
    }

    document.getElementById('formatted-time').innerHTML = timeString;
    document.getElementById('total-minutes').innerText = totalMinutes.toFixed(1);

    // Calculate "Finish By" time
    const now = new Date();
    const finishTime = new Date(now.getTime() + totalMinutes * 60000);
    
    // Format time nicely (e.g., 4:30 PM)
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    document.getElementById('completion-time').innerText = finishTime.toLocaleTimeString([], timeOptions);

    setTimeout(() => {
        updateIndicator.innerText = "UPDATED";
        updateIndicator.classList.remove('text-blue-400');
    }, 500);
}
