const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/auth/login', controller.login);

// Public registration
router.post('/users', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('username').notEmpty(),
], controller.create);

// Protected routes
router.get('/users', auth, controller.list);
router.get('/users/:id', auth, controller.get);
router.put('/users/:id', auth, controller.update);
router.delete('/users/:id', auth, controller.delete);

// Geolocation routes (protected)
router.get('/nearby-users', auth, controller.getNearbyUsers);
router.post('/update-location', auth, controller.updateLocation);

module.exports = router;
