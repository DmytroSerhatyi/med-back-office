- A button on each route: orders, patients should fetch data from a mock API

# Patients: https://api.mocki.io/v2/51597ef3
# Orders: https://api.mocki.io/v2/79fb05cb

- The result should be displayed in a list / grid below the button
- List / grid must include at least 4 columns
- Patient list should have an "age" column, calculated by date of birth
- A button to "favorite" should appear on each item row (in patients and orders pages)
- Add a third route that shows the items the user added to their favorites list
  (item can't be duplicated in the favorites list, item should be marked
  that it's in the favorites list)
- In the favorites-list route - a button on each item should remove the item from the list
- Should use ngrx

- Bonus 1: The favorites list should be filterable by a form input that filters
  by firstName (patient) / orderName (order)
- Bonus 2: Please make it look nice

Estimation:

Things to emphasize:
1. Used node v14.21.3 and npm v6.14.18. Newer node versions due to new strict version checks throw error about incompatibility of package versions.
Also specified angular packages require npm to be no more than v7. These were reasons to use old node version instead of updating package.json.
2. Store related entities for orders and patients defined in core directory.
This decision is based on the fact that settings related entities also defined in core, but the feature "settings" located in features directory.
3. Hebrew language filled with English for good testing UI.
