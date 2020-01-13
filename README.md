# common-time

Find common time for group meeting

[![npm Package Version](https://img.shields.io/npm/v/common-time.svg?maxAge=2592000)](https://www.npmjs.com/package/common-time)

## Installation
```bash
git clone https://github.com/beenotung/common-time
cd common-time
pnpm i || npm i
npm start
```

## Cli Usage
1. Share a sheet with participants, google sheet, USB file, or whatever medium
2. Each participants input their available timeslot
3. Save the file as csv under `res` folder
4. Run `npm start`
5. The command available and unavailable time will be saved in the csv files

## CSV File Format

| Month | Participant 1 | ... Participant N |
|---|---|---|
| Day | timeslot | timeslot |
| ... | ... | ... |

Extra columns after the Participant N separated by a blank column will be ignored

### Example CSV File

| January | Alice     | Bob         | Cherry      | Dave                 |   | Common NA   | Common A    |   | Format      | Meaning |
|---------|-----------|-------------|-------------|----------------------|---|-------------|-------------|---|-------------|---------|
| 14      | 0900-1200 | 18:00-21:00 | N/A         | 0900-1200, 1700-2200 |   | 00:00-23:59 |             |   | 0900-1200   | 9am to 12nn available |
| 15      | 1300-1700 | 9:00-19:00  | N/A         | 0900-1900            |   | 00:00-23:59 |             |   | 09:00-12:30 | 9am to 12.30 nn available |
| 16      | 1700-2200 | 9:00-19:00  | 16:00-22:00 | 1900-2200            |   | 22:01-23:59 |             |   | ALL DAY     | whole day available |
| 17      | 1300-2200 | 9:00-18:00  | All day     | 0900-2200            |   |             | 00:00-23:59 |   | N/A         | whole day not available |
| 18      | 2000-2200 | 11:00-13:00 | N/A         | 0900-2200            |   | 00:00-23:59 |             |   |  |  |
| 19      | 1700-2200 | 9:00-11:00  | N/A         | 0900-2200            |   | 00:00-23:59 |             |   |  |  |
| 20      | 0900-2200 | 9:00-18:00  | All day     | 0900-2200            |   |             | 00:00-23:59 |   |  |  |
| 21      | 0900-1500 | 9:00-18:00  | All day     | 0900-2200            |   |             | 00:00-23:59 |   |  |  |
| 22      | 0900-2200 | 9:00-18:00  | N/A         | 0900-2200            |   | 00:00-23:59 |             |   |  |  |
| 23      | 1400-2200 | 9:00-18:00  | N/A         | 1900-2200            |   | 00:00-23:59 |             |   |  |  |
| 24      | 0900-1500 | 9:00-18:00  | N/A         | 0900-2200            |   | 00:00-23:59 |             |   |  |  |


## API Usage
TODO write details
```typescript
import { start } from 'common-time/src/main'

// inplace file update
start('your-csv-folder')
```

## Remark
Timeslot fragment shorter than 15 minutes are skipped
