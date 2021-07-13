const { Schema, model } = require('mongoose');
  
  const collectionName = 'records';
  const schema = new Schema({
    key: String,
    value: String,
    counts: [Number],
  }, {
    timestamps: true
  });
  
  schema.index({
    createdAt: 1
  }, {
    background: true
  });
  
  module.exports = model(collectionName, schema);