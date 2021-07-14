const supertest = require('supertest');
const Start = require('../../start');
const dotenv = require('dotenv');

dotenv.config();
const APP_URI = `http://0.0.0.0:${process.env.PORT}`
const request = supertest(APP_URI);
const END_POINT_HEALTHCHECK = '/healthCheck';
const END_POINT_RECORDS = '/records';

// load up the app:
const startUp = new Start();


const before = (done) => {
    startUp.startExpress()
    .then(_ => done())
}

const after = (done) => {
    startUp.closeServer()
    .then(_ => done())
}
describe(`Integration tests`, () => {
    beforeAll((done) => before(done));

    afterAll((done) => after(done));
    
    it('returns 200 on health check', async () => {
        const { body } = await request.get(END_POINT_HEALTHCHECK).send({});
        expect(body.message).toEqual('Server up! Go to /guide to see usage guide.');
    })



    it('Should return Success on valid request body', async () => {
        const minCount = 2700, maxCount = 2800, startDate = '2017-01-05', endDate = '2019-12-12';
        const {
          body
        } = await request.post(END_POINT_RECORDS).send({
          startDate,
          endDate,
          minCount,
          maxCount
        });
    
        expect(body.code).toEqual(0);
        expect(body.msg).toEqual('Success');
        expect(Array.isArray(body.records)).toBe(true);
        body.records.forEach((record) => {
          expect(record.key).toBeDefined();
          expect(record.totalCount >= minCount && record.totalCount <= maxCount).toBe(true);
          expect(record.createdAt).toBeDefined();
          expect(record.totalCount).toBeDefined();
        });
      });

      it('Should return an array of 0 when date is in far future', async () => {
        const minCount = 2700, maxCount = 2800, startDate = '2037-01-05', endDate = '2039-12-12';
        const {
            body
          } = await request.post(END_POINT_RECORDS).send({
          startDate,
          endDate,
          minCount,
          maxCount
        });
        expect(body.code).toEqual(0);
        expect(body.msg).toEqual('Success');
        expect(Array.isArray(body.records)).toBe(true);
        expect(body.records.length).toBe(0);
      });

      it('Should return an error when mincount is of type date', async () => {
        const minCount = new Date(), maxCount = 2800, startDate = '2017-01-05', endDate = '2019-12-12';
        const {
            body
          } = await request.post(END_POINT_RECORDS).send({
          startDate,
          endDate,
          minCount,
          maxCount
        });
        expect(body.code).toEqual(422);
        expect(body.msg).toEqual('unsuccessful');
        expect(body.records).toBe(undefined);
        expect(body.error.details[0].message).toEqual(`"minCount" must be a number`);
      });
})


