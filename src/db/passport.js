import passport from 'passport';
import { Strategy } from 'passport-local';
import User from './models/User';

passport.use(new Strategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { code: 404, message: 'Неверное имя пользователя.' })
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) {
        return done(null, false, { code: 401, message: 'Неверный пароль.' });
      }
      return done(null, user, { code: 200 });
    });
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  
  User.findById(id, (err, user) => {
    console.log('deserializeUser, findById');
    done(err, user);
  });
});