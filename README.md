# common-time

Find common time for group meeting

[![npm Package Version](https://img.shields.io/npm/v/common-time.svg?maxAge=2592000)](https://www.npmjs.com/package/common-time)

## Remark
- Excel template can be downloaded: [TimeList-2020-January.csv](./res/TimeList-2020-January.csv)
- Timeslot fragments shorter than 15 minutes are skipped by default.

## Installation
```bash
npm i -g common-time
```

## Cli Usage
1. Share a sheet with participants, google sheet, USB file, or whatever medium
2. Each participants input their available timeslot
3. Save the file as csv under a folder
4. `cd` to the above folder in a terminal
4. Run `common-time`
5. The common available and unavailable timeslot will be saved in the csv files

You can specific the path to folder as `common-time path-to-folder`.
It will scan all the csv files (non-recursively) in the specific folder.

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

| January | Alice     | Bob        | Cherry      | Dave                            |
|---------|-----------|------------|-------------|---------------------------------|
| 14      | 0900-1200 | 9:00-16:00 | N/A         | 0900-1200, 1700-1800, 2100-2200 |
| 15      | 1300-1700 | 18:00-1:00 |             | 0900-1900                       |
| 16      | 1700-2200 | 18:00-1:00 | 16:00-22:00 | 1900-2200                       |
| 17      | 1300-2200 | 17:00-1:00 | All day     | 0900-2200                       |
| 18      | 2000-2200 | N/A        | N/A         | 0900-2200                       |
| 19      | 1700-2200 | All day    | N/A         | 0900-2200                       |
| 20      | 0900-2200 | 1700-2200  | All day     | 0900-2200                       |
| 21      | 0900-1500 | N/A        | All day     | 0900-2200                       |
| 22      | 0900-2200 | N/A        | N/A         | 0900-2200                       |
| 23      | 1400-2200 | 18:00-1:00 | N/A         | 1900-2200                       |
| 24      | 0900-1500 | 1700-2200  | N/A         | 0900-2200                       |

#### Sample Output

| Common NA                | Common A    |
|--------------------------|-------------|
| ALL DAY                  |             |
| ALL DAY                  |             |
| 00:00-18:59, 22:01-23:59 | 19:00-22:00 |
| 00:00-16:59, 22:01-23:59 | 17:00-22:00 |
| ALL DAY                  |             |
| ALL DAY                  |             |
| 00:00-16:59, 22:01-23:59 | 17:00-22:00 |
| ALL DAY                  |             |
| ALL DAY                  |             |
| ALL DAY                  |             |
| ALL DAY                  |             |

## API Usage
TODO write details
```typescript
import { start } from 'common-time/src/main'

// inplace file update
start({
  dir: 'your-csv-folder',
  minimum_duration_in_minutes: 15,
})
```
