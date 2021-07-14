const recordQueries = require('../../src/queries/recordQueries');

describe('query unit tests', () => {
  const minCount = 2700;
  const maxCount = 2800;
  const startDate = '2017-01-05';
  const endDate = '2019-12-12';
  it('returns the right query', async () => {
    const queryToExecute = recordQueries('fetchRecord', {
      startDate, endDate, minCount, maxCount,
    });
    expect(Array.isArray(queryToExecute)).toBe(true);
    expect(queryToExecute[0].$match.$and[0].createdAt.$gte).toEqual(new Date(startDate));
    expect(queryToExecute[0].$match).toBeDefined();
    expect(queryToExecute[3].$project).toBeDefined();
  });

  it('throws an error on wrong query', async () => {
    try {
      recordQueries('fetchRecorders', { });
    } catch (error) {
      expect(error.code).toBe(500);
      expect(error.message).toEqual('No query matching fetchRecorders found in recordQueries');
    }
  });
});
