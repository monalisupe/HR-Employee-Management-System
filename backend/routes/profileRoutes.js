// const express = require("express");
// const authenticate = require("../middleware/authenticate");
// const { getMyProfile } = require("../controllers/profileController");

// const router = express.Router();

// router.get("/me", authenticate , getMyProfile);

// module.exports = router;


const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
  getMyProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", authenticate, getMyProfile);

module.exports = router;

