const CustomError = require('../utils/customError');

const queries = {
  fetchRecord: ({
    startDate, endDate, minCount, maxCount,
  }) => {
    const {
      date, count, sum, project,
    } = {
      date: {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: new Date(startDate),
              },
            },
            {
              createdAt: {
                $lte: new Date(endDate),
              },
            },
          ],
        },
      },
      sum: {
        $addFields: {
          totalCount: {
            $sum: '$counts',
          },
        },
      },
      count: {
        $match: {
          $and: [
            {
              totalCount: {
                $lte: maxCount,
              },
            },
            {
              totalCount: {
                $gte: minCount,
              },
            },
          ],
        },
      },
      project: {
        $project: {
          _id: 0,
          key: 1,
          createdAt: 1,
          totalCount: 1,
        },
      },
    };
    // put in array for aggregation
    return [date, sum, count, project];
  },
};

const recordQueries = (name, args) => {
  if (!queries[name] || typeof queries[name] !== 'function') {
    throw new CustomError(`No query matching ${name} found in recordQueries`);
  }
  return queries[name](args);
};

module.exports = recordQueries;
