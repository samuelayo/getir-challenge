const Joi = require('joi'); 
const CustomError = require('../utils/customError');
const recordService = require('../services/recordService');

const processFetchSchema = Joi.object().keys({ 
    startDate: Joi.date().required(),
    endDate: Joi.date().required(), 
    minCount: Joi.number().required(),
    maxCount: Joi.number().required()
});

/**
 * @param {*} requestBody
 * Sample -> { "startDate": "2016-01-26", "endDate": "2018-02-02", "minCount": 2700, "maxCount": 3000 }
 * returns @Void
 */
const validateRequest = (requestBody) => {
    const { error } = processFetchSchema.validate(requestBody); 
    const valid = error == null; 
    if (!valid) { 
        throw new CustomError("Invalid Request", 422, error);
    } 
}


/**
 * @param {*} req -> express request object
 * @param {*} res -> express response object
 */
const processFetch = async(req, res) => {
    try {
        const { body } = req;
        validateRequest(body);
        const records = await recordService.fetchRecord(body);
        return res.status(200).json({
            code: 0,
            msg: 'Success',
            records,
          })
    } catch (error) {
        return res.status(error.code).json( {
            code: error.code,
            msg: 'unsuccessful', 
            error: (error.error || error.message) 
        });
    }
}


module.exports = {
    processFetch
}