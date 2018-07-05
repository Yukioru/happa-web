import passport from 'passport';
import { Strategy as LocalStategy } from 'passport-local';
import { Strategy as TwitchStrategy } from 'passport-twitch';
import cfg from '../../config';
import { authentication } from '../middlewares';
import User from './models/User';

export default app => {
  passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
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
      scope: "user:read:email"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('twitch profile', profile);
        const twitchUser = profile._json;
        const user = await User.findOne({ twitchId: twitchUser.id });
        console.log('user', user);
        if (!user) {
          const newUser = await User.create({
            username: twitchUser.login,
            displayName: twitchUser.display_name,
            avatar: twitchUser.profile_image_url,
            twitchId: twitchUser.id,
          });
          console.log('newUser', newUser);
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