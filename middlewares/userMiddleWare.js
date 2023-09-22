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
      req.body = { ...req.body, user_id: tokenData.user_id }
      next();
    } else {
      res.status(401).send({ message: "invalid token" })
    }
  } else {
    res.status(401).send({ message: "token not match any user to database" })
  }
}

const loginAuthentication = (req, res, next) => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }

    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
  passport.authenticate('local', { failureMessage: true })
  next()
}

module.exports = { validateToken, loginAuthentication }