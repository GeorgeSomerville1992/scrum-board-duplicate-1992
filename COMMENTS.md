### Achitecture

Modern based vite app with react router and tailwind

- vi.test for unit tests
- Date-fns for easy formatting and sorting
- Tailwind for basic styling and colour theme

### General comments/thoughts

- Input box always stays focused thanks to memoiszation of initial placeholder component.
- Basic responsive layout using 2 columns for desktop and one for mobile
- Uses storage and can clear
- If a new idea is added and a sort filter is active. That idea will be sorted. I used useRef to preseve sorting value between renders

### Test suite

- Test suite covers full user follow, (adding, editing, deleting) sorting of ideas
- Included within tests are testing of correct notification text

### Optimisation

- Correct Auto focus was a bit of a challange, I wanted to keep the focus on the first input even after the user had created an idea.
  - I split the the creation of an idea in it's own component so that I could control when it rendered based if a user added or deleted a input
- Other small optimisations include computing disabled button variable and close to maxLength. To stop unnecessary calculations from happening.
