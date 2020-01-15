# common-time

Find common time for group meeting

[![npm Package Version](https://img.shields.io/npm/v/common-time.svg?maxAge=2592000)](https://www.npmjs.com/package/common-time)

## Installation
```bash
git clone https://github.com/beenotung/common-time
cd common-time
pnpm i || npm i
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

### Timeslot format

| Example | Meaning |
|---|---|
| 0900-1200 | 9am to 12nn available |
| 09:00-12:30 | 9am to 12.30 nn available |
| ALL DAY | whole day available |
| N/A | whole day not available |
| 0900-1200, 1700-1900 | 9am to 12nn and 5pm to 7pm are available |

### Example CSV File

#### Sample Input

| January | Alice     | Bob         | Cherry      | Dave                 |
|---------|-----------|-------------|-------------|----------------------|
| 14      | 0900-1200 | 18:00-21:00 | N/A         | 0900-1200, 1700-2200 |
| 15      | 1300-1700 | 9:00-19:00  | N/A         | 0900-1900            |
| 16      | 1700-2200 | 9:00-19:00  | 16:00-22:00 | 1900-2200            |
| 17      | 1300-2200 | 9:00-18:00  | All day     | 0900-2200            |
| 18      | 2000-2200 | 11:00-13:00 | N/A         | 0900-2200            |
| 19      | 1700-2200 | 9:00-11:00  | N/A         | 0900-2200            |
| 20      | 0900-2200 | 9:00-18:00  | All day     | 0900-2200            |
| 21      | 0900-1500 | 9:00-18:00  | All day     | 0900-2200            |
| 22      | 0900-2200 | 9:00-18:00  | N/A         | 0900-2200            |
| 23      | 1400-2200 | 9:00-18:00  | N/A         | 1900-2200            |
| 24      | 0900-1500 | 9:00-18:00  | N/A         | 0900-2200            |

#### Sample Output

| Common NA                | Common A    |
|--------------------------|-------------|
| ALL DAY                  |             |
| ALL DAY                  |             |
| ALL DAY                  |             |
| 00:00-12:59, 18:01-23:59 | 13:00-18:00 |
| ALL DAY                  |             |
| ALL DAY                  |             |
| 00:00-08:59, 18:01-23:59 | 09:00-18:00 |
| 00:00-08:59, 15:01-23:59 | 09:00-15:00 |
| ALL DAY                  |             |
| ALL DAY                  |             |
| ALL DAY                  |             |

## API Usage
TODO write details
```typescript
import { start } from 'common-time/src/main'

// inplace file update
start('your-csv-folder')
```

## Remark
Timeslot fragment shorter than 15 minutes are skipped
