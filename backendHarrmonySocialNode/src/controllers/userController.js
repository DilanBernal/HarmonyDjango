const repo = require('../repositories/userRepository');
const usecases = require('../usecases/userUsecases');

module.exports = {
  list: async (req, res) => {
    const users = await repo.list();
    res.json(users);
  },

  get: async (req, res) => {
    const user = await repo.getById(req.params.id);
    if (!user) return res.status(404).json({ detail: 'Not found' });
    res.json(user);
  },

  create: async (req, res) => {
    try {
      console.log(req)
      const { email, username, password, location } = req.body;
      const user = await usecases.registerUser(email, username, password, location);
      res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ detail: err.message });
    }
  },

  update: async (req, res) => {
    const updated = await repo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ detail: 'Not found' });
    res.json(updated);
  },

  delete: async (req, res) => {
    await repo.delete(req.params.id);
    res.status(204).send();
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const result = await usecases.authenticateUser(email, password);
    if (!result) return res.status(401).json({ detail: 'Invalid credentials' });
    const { user, token, refresh } = result;
    res.json({ access: token, refresh, user });
  },

  // Endpoint para obtener usuarios cercanos
  getNearbyUsers: async (req, res) => {
    try {
      const { lat, lng, distance } = req.query;
      
      // Validar parámetros
      if (!lat || !lng) {
        return res.status(400).json({ detail: 'Latitude and longitude are required' });
      }

      // Obtener ID del usuario desde el token (middleware auth)
      const userId = req.user.sub;
      const maxDistance = distance ? parseFloat(distance) : 5; // Valor por defecto: 5 km
      
      const nearbyUsers = await usecases.getNearbyUsers(
        userId,
        parseFloat(lat),
        parseFloat(lng),
        maxDistance
      );
      
      res.json(nearbyUsers);
    } catch (err) {
      return res.status(400).json({ detail: err.message });
    }
  },

  // Endpoint para actualizar la ubicación del usuario
  updateLocation: async (req, res) => {
    try {
      const { lat, lng } = req.body;
      
      // Validar parámetros
      if (lat === undefined || lng === undefined) {
        return res.status(400).json({ detail: 'Latitude and longitude are required' });
      }

      // Obtener ID del usuario desde el token (middleware auth)
      const userId = req.user.sub;
      
      const user = await usecases.updateUserLocation(
        userId,
        parseFloat(lat),
        parseFloat(lng)
      );
      
      res.json(user);
    } catch (err) {
      return res.status(400).json({ detail: err.message });
    }
  }
};
