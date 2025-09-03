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
};
