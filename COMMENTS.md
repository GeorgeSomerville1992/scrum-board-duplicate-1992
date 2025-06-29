### Achitecture

Modern based vite app with react router and tailwind

- vi.test for unit tests
- Date-fns for easy formatting and comparing of dates
- sorting and filtering using

### Deployment link

https://scrum-board-duplicate-1992.vercel.app/

### General comments/thoughts

- Input box always stays focused thanks to memoiszation of initial placeholder component. This will only render again when the length of ideas changes, always keeping the original placeholder focused when new idea is created.
- Basic responsive layout using 2 columns for desktop and one for mobile
- Uses storage and can clear
- If a new idea is added and a sort filter is active. That idea will be sorted.
