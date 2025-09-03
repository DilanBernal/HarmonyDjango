const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profile_image: { type: String },
  favorite_instrument: { type: String },
  learning_points: { type: Number, default: 0 },
  is_artist: { type: Boolean, default: false },
  // location expected from frontend as { lat: Number, lng: Number }
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  is_staff: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  password: { type: String, required: true },
}, { timestamps: true });

UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
