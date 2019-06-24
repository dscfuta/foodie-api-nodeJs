// Example model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('./helpers');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
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
