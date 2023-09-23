const accessTokenModel = require("../models/access_token");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/user");
const bcrypt = require('bcrypt');
// const passport = require('passport');
// initializingPassport(passport)

// const validateToken = async (req, res, next) => {
//   const { id } = req.headers
//   if (id) {
//     next();
//   } else {
//     res.status(500).send({ message: "Please enter id" })
//   }
// }

const validateToken = async (req, res, next) => {
  const { token } = req.headers
  if (!token) {
    res.status(404).send({ message: "token not found" })
    return;
  }

  const tokenData = await accessTokenModel.findOne({ where: { access_token: token } })
  if (tokenData) {
    const expiryTime = tokenData.expiry
    const currentTime = new Date();
    if (currentTime < expiryTime) {
      // req.body = { ...req.body, user_id: tokenData.user_id }
      next();
    } else {
      res.status(401).send({ message: "invalid token" })
    }
  } else {
    res.status(401).send({ message: "token not match any user to database" })
  }
}


const loginAuthentication = (req, res, next) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const dbUser = await User.findOne({ where: { username } });
        if (!dbUser) {
          return done(null, false, { message: 'please enter correct username.' });
        }
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
          return done(null, false, { message: 'please enter correct password.' });
        }
        return done(null, dbUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    next()
  })(req, res, next);
};


module.exports = { validateToken, loginAuthentication }