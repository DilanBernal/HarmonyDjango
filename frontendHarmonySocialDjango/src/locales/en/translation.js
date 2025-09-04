const base = {
  "login": {
    "title": "Sign in to HarmonySocial",
    "email": "Email",
    "password": "Password",
    "button": "Sign in",
    "loading": "Signing in...",
    "success": "Logged in successfully",
    "failed": "Login failed"
  }
};

const extras = {
  "register": {
    "title": "Create an account",
    "email": "Email",
    "username": "Username",
    "password": "Password",
    "button": "Create account",
    "loading": "Creating...",
    "success": "Account created",
    "failed": "Registration failed",
    "have_account": "I have an account"
  ,
    "location_title": "Location",
    "location_help": "Click on the map to select your location"
  },
  "home": {
    "title": "Home",
    "welcome": "Welcome to HarmonySocial. Here you can see musicians near you.",
    "logout": "Log out",
    "mapTitle": "Nearby Users Map",
    "nearbyUsers": "Nearby Users",
    "loading": "Loading...",
    "clickMapToUpdate": "Click on the map to update your location",
    "locationError": "Error getting your location",
    "browserLocationNotSupported": "Your browser does not support geolocation",
    "fetchError": "Error fetching nearby users",
    "noNearbyUsers": "No nearby users at the moment",
    "artist": "Artist"
  }
};

export default { ...base, ...extras };

export const register_extra = {
  "register": {
    "title": "Create an account",
    "email": "Email",
    "username": "Username",
    "password": "Password",
    "button": "Create account",
    "loading": "Creating...",
    "success": "Account created",
    "failed": "Registration failed",
    "have_account": "I have an account"
  },
  "home": {
    "title": "Home",
    "welcome": "Welcome to HarmonySocial. Here you can see musicians near you.",
    "logout": "Log out",
    "mapTitle": "Nearby Users Map",
    "nearbyUsers": "Nearby Users",
    "loading": "Loading...",
    "clickMapToUpdate": "Click on the map to update your location",
    "locationError": "Error getting your location",
    "browserLocationNotSupported": "Your browser does not support geolocation",
    "fetchError": "Error fetching nearby users",
    "noNearbyUsers": "No nearby users at the moment",
    "artist": "Artist"
  }
};
