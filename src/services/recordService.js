const recordModel = require('../models/record');
const recordQueries = require('../queries/recordQueries');

const fetchRecord = async ({
  startDate, endDate, minCount, maxCount,
}) => {
  const queryToExecute = recordQueries('fetchRecord', { startDate, endDate, minCount, maxCount });
  return await recordModel.aggregate(queryToExecute);
};

module.exports = {
  fetchRecord
};