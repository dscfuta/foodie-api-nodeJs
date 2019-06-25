const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const RecipeSchema = new Schema({
  name: String,
  image: String,
  vendor: ObjectId,
});

mongoose.exports = mongoose.models.Recipes || mongoose.model('Recipes', RecipeSchema);
