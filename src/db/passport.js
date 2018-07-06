import passport from 'passport';
import { Strategy as LocalStategy } from 'passport-local';
import { Strategy as TwitchStrategy } from 'passport-twitchtv';
import cfg from '../../config';
import { authentication } from '../middlewares';
import User from './models/User';

export default app => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  
  passport.use(new LocalStategy(async (username, password, done) => {
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

  passport.use(new TwitchStrategy({
      clientID: cfg.twitch.clientId,
      clientSecret: cfg.twitch.secretKey,
      callbackURL: cfg.twitch.callback,
      scope: 'user_read',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const twitchUser = profile._json;
        const user = await User.findOne({ twitchId: twitchUser._id });
        if (!user) {
          const newUser = await User.create({
            username: twitchUser.name,
            displayName: twitchUser.display_name,
            avatar: twitchUser.logo,
            twitchId: twitchUser._id,
          });
          return done(null, newUser, { code: 200 });
        }
        return done(null, user, { code: 200 });
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.authenticationMiddleware = authentication;
}