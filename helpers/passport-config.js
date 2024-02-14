const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.localStrategy = () => {
    return new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const result = await User.findOne({ email: email });
          if (!result) {
            return done(null, false, { message: "Użytkownik nie znaleziony" });
          }
          const passwordMatches = await bcrypt.compare(password, result.password);
  
          if (!passwordMatches) {
            return done(null, false, { message: "Nieprawidłowe dane uwierzytelniające" });
          }
  
          const user = {
            id: result._id.toString(),
            first_name: result.first_name,
            last_name: result.last_name,
            username: result.username,
            email: result.email,
            password: result.password,
          };
  
          return done(null, user, { message: "Użytkownik zalogowany" });
        } catch (error) {
          return done(error);
        }
      }
    );
  };

exports.serializeUserFunction = (user, done) => done(null, user.id);

exports.deserializeUserFunction = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};