document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const inputs = {
        rate: document.getElementById('rate'),
        target: document.getElementById('target'),
        current: document.getElementById('current')
    };

    // Main Display Elements
    const display = {
        formatted: document.getElementById('formatted-time'),
        minutes: document.getElementById('total-minutes'),
        completion: document.getElementById('completion-time'),
        sysStatus: document.getElementById('sys-status-text')
    };

    const updateIndicator = document.getElementById('update-indicator');
    const calendarBtn = document.getElementById('calendar-btn');
    const addTimerBtn = document.getElementById('add-timer-btn');
    const timersSection = document.getElementById('timers-section');
    const timersList = document.getElementById('timers-list');

    // Global Variables
    let calculatedMinutes = 0;
    let remainingAmount = 0;
    let audioContext = null;
    const activeTimers = {}; // Store interval IDs by timestamp key

    // --- Event Listeners ---
    Object.values(inputs).forEach(input => input.addEventListener('input', calculateTime));
    
    if (calendarBtn) calendarBtn.addEventListener('click', addToCalendar);
    if (addTimerBtn) addTimerBtn.addEventListener('click', addTimer);

    // --- Core Calculation Logic ---
    function calculateTime() {
        const rate = parseFloat(inputs.rate.value);
        const target = parseFloat(inputs.target.value);
        const current = parseFloat(inputs.current.value) || 0;

        // Validation
        if (!rate || !target || rate <= 0 || target <= 0) {
            document.getElementById('results-container').classList.add('opacity-50');
            disableButtons();
            resetDisplay();
            updateIndicator.innerText = "WAITING...";
            return;
        }

        // Calculation
        remainingAmount = target - current;
        if (remainingAmount <= 0) {
            remainingAmount = 0;
            calculatedMinutes = 0;
        } else {
            calculatedMinutes = remainingAmount / rate;
        }

        // Enable UI
        document.getElementById('results-container').classList.remove('opacity-50');
        updateIndicator.innerText = "UPDATED";
        
        if (calculatedMinutes > 0) {
            enableButtons();
        } else {
            disableButtons();
        }

        // Update Text
        const hours = Math.floor(calculatedMinutes / 60);
        const minutes = Math.floor(calculatedMinutes % 60);
        const seconds = Math.floor((calculatedMinutes * 60) % 60);

        let timeString = '';
        if (hours > 0) timeString += `${hours} <span class="text-sm text-slate-500">HR</span> `;
        timeString += `${minutes} <span class="text-sm text-slate-500">MIN</span>`;
        if (hours === 0 && minutes === 0 && calculatedMinutes > 0) {
            timeString = `${seconds} <span class="text-sm text-slate-500">SEC</span>`;
        } else if (calculatedMinutes === 0) {
            timeString = `<span class="text-emerald-400">DONE</span>`;
        }

        display.formatted.innerHTML = timeString;
        display.minutes.innerText = calculatedMinutes.toFixed(1);

        // Completion Time
        const finishTime = new Date(Date.now() + calculatedMinutes * 60000);
        display.completion.innerText = finishTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    // --- Multi-Timer Logic ---

    function addTimer() {
        if (calculatedMinutes <= 0) return;

        // 1. Request Notification Permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        // 2. Setup Data
        const timerId = Date.now();
        const durationMs = calculatedMinutes * 60000;
        const endTime = timerId + durationMs;
        const targetAmount = remainingAmount; // Capture current value
        
        // 3. Show Timer Section
        timersSection.classList.remove('hidden');

        // 4. Create UI Card
        const card = document.createElement('div');
        card.className = 'timer-card rounded-lg p-3 relative overflow-hidden';
        card.id = `card-${timerId}`;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <div class="flex-grow mr-2">
                    <input type="text" 
                           class="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-blue-500 text-sm font-bold text-emerald-400 w-full focus:outline-none mb-1 transition-colors px-0 py-0.5" 
                           value="Grind Session" 
                           placeholder="Name your grind...">
                    <div class="text-[10px] text-slate-400 uppercase tracking-widest">Target: ${targetAmount.toLocaleString()}</div>
                    <div class="text-2xl font-mono text-white font-bold leading-none mt-1" id="display-${timerId}">00:00:00</div>
                </div>
                <button onclick="removeTimer(${timerId})" class="text-slate-500 hover:text-red-400 transition p-1 shrink-0">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                <div id="bar-${timerId}" class="bg-blue-500 h-full w-full origin-left transition-all duration-1000"></div>
            </div>
        `;
        
        timersList.prepend(card);

        // 5. Start Interval
        const intervalId = setInterval(() => {
            updateTimer(timerId, endTime, durationMs, targetAmount);
        }, 100);

        // Store active timer
        activeTimers[timerId] = intervalId;

        // Make button accessible globally for the onclick handler
        window.removeTimer = removeTimer;
    }

    function updateTimer(id, endTime, totalDuration, amount) {
        const now = Date.now();
        const diff = endTime - now;
        const displayEl = document.getElementById(`display-${id}`);
        const barEl = document.getElementById(`bar-${id}`);
        const cardEl = document.getElementById(`card-${id}`);

        if (!displayEl) {
            // Element removed, stop interval
            clearInterval(activeTimers[id]);
            delete activeTimers[id];
            return;
        }

        if (diff <= 0) {
            // Finished
            clearInterval(activeTimers[id]);
            delete activeTimers[id];
            
            displayEl.innerText = "COMPLETE";
            displayEl.classList.add('text-red-500', 'animate-pulse');
            cardEl.classList.add('finished');
            
            // Get user-set title for notification
            const titleInput = cardEl.querySelector('input');
            const customTitle = titleInput ? titleInput.value : "Grind Complete!";
            
            triggerAlarm(amount, customTitle);
        } else {
            // Update Time
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            displayEl.innerText = 
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            
            // Update Bar
            const percent = (diff / totalDuration) * 100;
            barEl.style.width = `${percent}%`;
        }
    }

    function removeTimer(id) {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.remove();
        }
        if (activeTimers[id]) {
            clearInterval(activeTimers[id]);
            delete activeTimers[id];
        }
        
        // Hide section if empty
        if (timersList.children.length === 0) {
            timersSection.classList.add('hidden');
        }
    }

    function triggerAlarm(amount, title) {
        playBeep();

        if ("Notification" in window && Notification.permission === "granted") {
            try {
                new Notification(title || "Grind Complete!", {
                    body: `Target reached: ${amount.toLocaleString()} currency`,
                    icon: "https://cdn-icons-png.flaticon.com/512/10009/10009908.png"
                });
            } catch (e) {
                console.log("Notification failed", e);
            }
        }
    }

    // --- Audio Logic ---
    function playBeep() {
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sawtooth'; 
            oscillator.frequency.value = 440; 
            
            oscillator.start();
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) { console.error(e); }
    }

    // --- Helpers ---
    function enableButtons() {
        calendarBtn.disabled = false;
        calendarBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        addTimerBtn.disabled = false;
        addTimerBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    function disableButtons() {
        calendarBtn.disabled = true;
        calendarBtn.classList.add('opacity-50', 'cursor-not-allowed');
        addTimerBtn.disabled = true;
        addTimerBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    function resetDisplay() {
        display.formatted.innerHTML = '-- <span class="text-sm text-slate-500">HR</span> -- <span class="text-sm text-slate-500">MIN</span>';
        display.minutes.innerText = '0';
        display.completion.innerText = '--:--';
    }

    function addToCalendar() {
        if (calculatedMinutes <= 0) return;
        const now = new Date();
        const finishTime = new Date(now.getTime() + calculatedMinutes * 60000);
        const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const finishStr = formatDate(finishTime);
        const title = `Grind Complete: ${remainingAmount.toLocaleString()} Currency`;
        const details = `Goal: Farm ${remainingAmount.toLocaleString()} currency.\nRate: ${inputs.rate.value}/min.\nTotal Duration: ${Math.ceil(calculatedMinutes)} minutes.`;
        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${finishStr}/${finishStr}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
        window.open(googleCalUrl, '_blank');
    }
});
