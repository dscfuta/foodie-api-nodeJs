const mongoose = require('mongoose');

const { Schema } = mongoose;
// const { ObjectId } = mongoose.Schema.Types;

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
});

mongoose.exports = mongoose.models.Recipes || mongoose.model('Recipe', RecipeSchema);
