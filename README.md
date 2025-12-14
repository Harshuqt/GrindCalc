Here is the updated `README.md` incorporating the new features (Timers, Notifications, Calendar) while maintaining the installation options we discussed.


# GrindCalc - In-Game Currency Calculator & Timer

A cyberpunk-themed productivity tool designed for gamers. GrindCalc helps you calculate exactly how long you need to farm to reach a currency goal and provides multiple simultaneous timers to track your sessions.

## 🚀 Features

### 🧮 Calculator
* **Real-time Logic:** Instantly calculates grind time based on your earning rate (e.g., Gold/Min).
* **Smart Deduction:** Input your "Current Balance" to calculate only the remaining time needed.
* **Precision:** Displays results in Hours/Minutes and exact clock completion time.

### ⏱️ Multi-Timer System
* **Concurrent Tracking:** Run multiple timers at once for different games or goals.
* **Editable Titles:** Click the timer name (default "Grind Session") to rename it (e.g., "Ranked Queue", "Boss Respawn").
* **Background Aware:** Timers continue running even if you switch tabs.

### 🔔 Alerts & Integration
* **Browser Notifications:** Get a desktop popup when your grind is done, even if you are alt-tabbed in-game.
* **Audio Feedback:** A custom cyberpunk sound effect plays upon completion.
* **Google Calendar:** One-click button to schedule your grind session as a calendar event.

## 🛠️ Installation

GrindCalc is a static web application. It requires no backend server.

> **⚠️ Important Note on Notifications:**
> For Browser Notifications to work reliably in Chrome/Edge, it is recommended to run this using a local server (like **VS Code's "Live Server" extension**) or host it on **GitHub Pages**. Some browsers block notifications from files opened directly via the `file://` protocol.

### Option 1: Power Users (Git Clone)
```bash
git clone [https://github.com/yourusername/grindcalc.git](https://github.com/yourusername/grindcalc.git)
cd grindcalc
# Recommend running via a local server (e.g., npx http-server)
`````

### Option 2: Download ZIP

1.  Click the **Code** button and select **Download ZIP**.
2.  Extract the ZIP file to a folder.
3.  Open the folder in VS Code and use Live Server (recommended) or double-click `index.html`.

### Option 3: Manual Setup

1.  **Download the files:**
      * `index.html`
      * `style.css`
      * `script.js`
2.  **Organize:** Place all three files in the same folder.
3.  **Run:** Open `index.html` in any modern web browser.

## 🎮 Usage

1.  **Set Your Rate:** Enter how much currency you make per minute.
2.  **Set Your Goal:** Enter the item cost in "Target Amount".
3.  **Plan:**
      * Check the **Estimated Time** to see how long it will take.
      * Click **Schedule** to block out time on Google Calendar.
4.  **Grind:**
      * Click **+ Add Timer** to start a countdown.
      * Click the text "Grind Session" on the timer card to **rename it**.
      * *You can add as many timers as you want\!*

## 🎨 Customization

  * **Visuals:** Modify `style.css` to change the color palette (currently Slate/Blue/Neon).
  * **Audio:** The beep sound is synthesized via the **Web Audio API** in `script.js` (no external audio files needed). You can tweak the frequency values in the `playBeep()` function.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.



### Key Updates in this version:
* **Added Notification Warning:** I placed the warning about `file://` protocols blocking notifications inside a blockquote (`>`) so users see it immediately.
* **Features Grouping:** Grouped features under Calculator, Timers, and Alerts headers for better readability.
* **Updated Installation:** Kept the `git clone` and ZIP options, but updated the advice to suggest using a local server (like Live Server) to ensure the new notification features work correctly.

Would you like me to create the `script.js` code that handles the Web Audio API and Notifications mentioned here?
