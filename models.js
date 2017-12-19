
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
module.exports.User = mongoose.model('User', new Schema({
  id:           ObjectId,
  firstName:    { type: String, required: '{PATH} is required.' },
  lastName:     { type: String, required: '{PATH} is required.' },
  email:        { type: String, required: '{PATH} is required.', unique: true },
  password:     { type: String, required: '{PATH} is required.' },
  data:         Object,
},{usePushEach: true}));
