const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CartSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  recipe: { type: ObjectId, ref: 'Recipe' },
  quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model('Cart', CartSchema);
