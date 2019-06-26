const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const OrderSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  cart: { type: ObjectId, ref: 'Cart' },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: String,
});

module.exports = mongoose.model('Order', OrderSchema);
