import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';

export default app => {
  mongoose.connect('mongodb://localhost:27017/happa-web');

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    console.log('db connected');
    require('./models/User').default;
  });

  const MongoStore = connectMongo(session);

  app.use(session({
    store: new MongoStore({ mongooseConnection: db }),
    secret: 'kek',
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 2630000 * 5, // 5 months
    },
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
}