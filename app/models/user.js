// Example model
const mongoose = require('mongoose');
const helper = require('./helpers');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    phone: String,
  },
  {
    strictQuery: true,
    timestamps: true,
  },
);

UserSchema.set('toObject', {
  virtuals: true,
});
UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', helper.saveUser);
UserSchema.methods.comparePassword = helper.compareUserPassword;
UserSchema.methods.generateJwt = helper.generateJwt;

module.exports = mongoose.models.Users || mongoose.model('Users', UserSchema);
