# receivables-analyzer

## Hello 👋, I am Alexandros.

## Description:
This repository provides a simple Full-stack application designed to accept, store receivables data, and retrieve summary statistics about the stored receivables data. The core focus is on providing information regarding the value of open and closed invoices.

#### Assumptions
- **Data Validation:**
  All monetary values (like openingValue and paidValue) are positive numbers.
  The issueDate is always earlier or the same as the dueDate.
  If closedDate is provided, it should be after the issueDate.
- **Invoice State:**
  If closedDate is provided, the invoice is considered closed. If not, it's considered open.
  If cancelled is true, then the invoice is neither open nor closed, but cancelled.
- **Date Format:**
  Dates provided in fields like issueDate, dueDate, and closedDate follow a standardized format, such as ISO 8601 (YYYY-MM-DD).
- **Data Completeness:**
  Only reference, currencyCode, issueDate, openingValue, paidValue, dueDate, debtorName, debtorReference, and debtorCountryCode are mandatory. Other fields are optional and can be left out without causing an error.
- **Lifecycle of Receivables:**
  An invoice's life cycle goes from 'issued' to either 'closed' or 'cancelled'. It cannot be both 'closed' and 'cancelled'.

### Core Technologies
- [NextJs](https://nextjs.org/docs) 13 API routes for the Back-end
- [Prisma](https://www.prisma.io/docs/concepts/database-connectors/sqlite) with SQLite db for storing the data
- [NextJs](https://nextjs.org/docs) 13 with [NextUI](https://nextui.org/) and [react-chartjs-2](https://react-chartjs-2.js.org/) for the Front-end

### Other Technologies
- [Zod](https://zod.dev/?id=introduction) for TypeScript-first schema declaration and validation
- [status-code-enum](https://www.npmjs.com/package/status-code-enum) for dev friendly HTTP status codes
- [Redux Toolkit](https://redux-toolkit.js.org/tutorials/rtk-query) and more specifically RTK Query to handle server side state with caching and optimistic updates

### Core Features:
- **Store Receivables:** Accept a payload with receivables data and store it.
- **Retrieve Statistics:** Return summary statistics about the stored receivables data, particularly the values of open and closed invoices.

## Installation

This project requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies.
```sh
npm i
```

Start the development server and open http://localhost:3000 with your browser to see the result.
```sh
npm run dev
```

## Usage

The first thing you can see after starting the development server and visiting http://localhost:3000 is an empty table, two buttons and an empty chart.
- **Table:** Showing the receivables currently saved in the database, updated with oprimistic updates technique
- **Buttons:** Used to create open or closed receivables
- **Chart:** Showing the total value of open and closed receivables ( invoices )

You can click the buttons and create open or closed receivables and see the table and chart updating live. Also by restarting the server you won't lose your data because we store everything in our Sqlite database. Isn't that awesome? 😀

By trying to stay strict on the timeframe of maximum 3 hours I haven't implemented a form to insert receivables or delete them.

But this cannot stop us from doing it. By executing the command bellow you can open the prisma studio ui (http://localhost:5555). There you can access the database and manipulate the records as needed.

```sh
npx prisma studio
```

If you are not a big fun of prisma studio don't worry, there is also another option. You can visit http://localhost:3000/receivables-analyzer.postman_collection.json to download the Postman collection and import it in your Postman http client.

> **Note!** Be sure that the development server is running first. Otherwise you can find Postman collectio inside the public folder.

## Additional info
### Best practices for the API
#### Used
- API versioning
- Endpoints naming
- Request body validation with specific error messages
- Error handling
- Swagger annotations
- Typed responses
- Clear status code syntax with status-code-enum package

#### Missing
- User Authentication
- Rate limiting ( makes more sense in production )
- Pagination for get receivables
- Tests

### Best practices for the Front-end
#### Used
- Optimistic Updates
- Caching

### Other best practices
### Used
- GIT meaningful commits

### Time Spend
- Initialize project: 15 mins
- Implement APIs: 1 hour
- Implement Front-end: 1 hour and 30 mins
- Testing, Final fixes and improvements: 15 mins
