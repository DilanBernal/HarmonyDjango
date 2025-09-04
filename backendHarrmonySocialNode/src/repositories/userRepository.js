const User = require('../models/User');

module.exports = {
  getById: async (id) => User.findById(id),
  getByEmail: async (email) => User.findOne({ email }),
  list: async () => User.find(),
  create: async (data) => {
    const user = new User(data);
  if (data.password) await user.setPassword(data.password);
    return user.save();
  },
  update: async (id, data) => {
    const user = await User.findById(id);
    if (!user) return null;
    Object.keys(data).forEach(k => {
      if (k === 'password') user.setPassword(data.password);
      else user[k] = data[k];
    });
    return user.save();
  },
  delete: async (id) => User.findByIdAndDelete(id),
  
  // Encuentra usuarios cercanos basado en coordenadas y un radio máximo en km
  findNearbyUsers: async (lat, lng, maxDistanceKm, currentUserId) => {
    const radiusOfEarthKm = 6371;
    const maxDistanceRadians = maxDistanceKm / radiusOfEarthKm;

    // Busca usuarios que tienen coordenadas y están dentro del radio especificado
    // y excluye al usuario actual
    return User.find({
      _id: { $ne: currentUserId }, // Excluye al usuario actual
      'location.lat': { $exists: true },
      'location.lng': { $exists: true }
    }).then(users => {
      // Filtrar usuarios dentro del radio
      return users.filter(user => {
        if (!user.location || !user.location.lat || !user.location.lng) return false;
        
        // Convertir a radianes
        const lat1 = lat * Math.PI / 180;
        const lat2 = user.location.lat * Math.PI / 180;
        const lng1 = lng * Math.PI / 180;
        const lng2 = user.location.lng * Math.PI / 180;
        
        // Cálculo de distancia usando fórmula haversine
        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = radiusOfEarthKm * c;
        
        user._doc.distance = distance; // Agregar distancia al objeto usuario
        return distance <= maxDistanceKm;
      });
    });
  },
  
  // Actualiza la ubicación de un usuario
  updateLocation: async (userId, lat, lng) => {
    return User.findByIdAndUpdate(
      userId,
      { 'location.lat': lat, 'location.lng': lng },
      { new: true }
    );
  }
};
