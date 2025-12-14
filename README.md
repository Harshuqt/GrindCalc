# GrindCalc - In-Game Currency Calculator

A  web tool designed for gamers to calculate how long it will take to farm a specific amount of in-game currency based on their earning rate.

## Features

* **Real-time Calculation:** Updates instantly as you type.
* **Time Estimation:** Shows results in Hours/Minutes and total raw minutes.
* **Completion Time:** Tells you the exact clock time you will finish grinding if you start now.
* **Current Balance Deduction:** Allows you to input currency you already own to calculate the remaining time needed.
* **Mobile Responsive:** Works perfectly on phones and desktops.

## Installation

This is a static web application, meaning it runs directly in your browser without any server setup. Choose the method that works best for you.

### Option 1: Power Users (Git Clone)
If you are comfortable with the terminal, simply clone the repository and open the file:

```bash
git clone [https://github.com/yourusername/grindcalc.git](https://github.com/yourusername/grindcalc.git)
cd grindcalc
# Open index.html in your browser manually, or use a command like:
# start index.html (Windows) or open index.html (Mac)
````

### Option 2: Download ZIP

1.  Click the **Code** button and select **Download ZIP**.
2.  Extract the ZIP file to a folder.
3.  Double-click `index.html` to launch the app.

### Option 3: Manual Setup

1.  **Download the files:**
      * `index.html`
      * `style.css`
      * `script.js`
2.  **Place them in a folder:** Ensure all three files are in the same directory.
3.  **Run:** Double-click `index.html` to open it in your default web browser.

## Usage

  * **Earning Rate:** Enter how much currency you make per minute (e.g., if a mission takes 10 mins and gives $500, your rate is $50/min).
  * **Target Amount:** Enter the total cost of the item you want to buy.
  * **Current Balance:** (Optional) Enter how much money you already have.
  * **View Results:** The calculator will display exactly how long you need to grind.

## Customization

  * **Colors:** Edit `style.css` to change the CSS variables or Tailwind classes to fit your favorite game's color scheme.
  * **Logic:** Modify `script.js` if you want to add tax calculations or different time formats.

## License

Distributed under the MIT License. See `LICENSE` for more information.
