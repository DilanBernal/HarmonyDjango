const repo = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

module.exports = {
  registerUser: async (email, username, password, location) => {
    const exists = await repo.getByEmail(email);
    if (exists) throw new Error('Email already registered');
    const payload = { email, username, password };
    if (location && typeof location === 'object') payload.location = location;
    const user = await repo.create(payload);
    // here you could trigger welcome email (out of scope)
    return user;
  },

  authenticateUser: async (email, password) => {
    const user = await repo.getByEmail(email);
    if (!user) return null;
    const ok = await user.checkPassword(password);
    if (!ok) return null;
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    const refresh = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token, refresh };
  },

  // Obtiene usuarios cercanos a la ubicación especificada
  getNearbyUsers: async (userId, lat, lng, maxDistanceKm = 5) => {
    if (!userId || !lat || !lng) {
      throw new Error('User ID, latitude, and longitude are required');
    }
    
    return repo.findNearbyUsers(lat, lng, maxDistanceKm, userId);
  },

  // Actualiza la ubicación de un usuario
  updateUserLocation: async (userId, lat, lng) => {
    if (!userId || lat === undefined || lng === undefined) {
      throw new Error('User ID, latitude, and longitude are required');
    }

    const updatedUser = await repo.updateLocation(userId, lat, lng);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  }
};
