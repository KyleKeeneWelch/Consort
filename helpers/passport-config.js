const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Defines new local strategy that will check email for existing user and password with hashed password in database and authenticates if so.
exports.localStrategy = () => {
  return new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const result = await User.findOne({ email: email });
        if (!result) {
          return done(null, false, { message: "User not found" });
        }
        const passwordMatches = await bcrypt.compare(password, result.password);

        if (!passwordMatches) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const user = {
          id: result._id.toString(),
          first_name: result.first_name,
          last_name: result.last_name,
          username: result.username,
          email: result.email,
          password: result.password,
        };

        return done(null, user, { message: "User logged in" });
      } catch (error) {
        return done(error);
      }
    }
  );
};

// Serializes user in session. (Sets ID)
exports.serializeUserFunction = (user, done) => done(null, user.id);

// Deserializes user in session (Gets ID)
exports.deserializeUserFunction = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};
