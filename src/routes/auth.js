import passport from 'passport';
import User from '../db/models/User';

export default app => {
  app.post('/api/auth/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.send(info);
      req.logIn(user, (err) => {
        if (err) return next(err);
        console.log(req.user);
        res.redirect('/');
        // res.send({
        //   ...info,
        //   data: user,
        // });
        next();
      });
    })(req, res, next);
  });

  app.post('/api/auth/signup', async (req, res) => {
    if (!req.body) return;
    if (req.isAuthenticated()) return;
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.send({ code: 409 });
      return;
    }
    if (req.body.password === req.body.confirm) {
      try {
        const newUser = await User.create({
          username: req.body.username,
          displayName: req.body.username,
          password: req.body.password,
        });
        await new Promise(resp => {
          req.logIn(newUser, resp);
        });
        res.redirect('/');
        // res.send({ code: 200, data: newUser });
      } catch (error) {
        throw new Error(error);
      }
    }
  });

  app.get('/api/auth/twitch', passport.authenticate('twitchtv'));

  app.get('/api/auth/twitch/callback', 
    passport.authenticate('twitchtv', { failureRedirect: '/auth/signin' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

};
