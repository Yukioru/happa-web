const privateKeys = [
  'admin',
  'schedule',
];

export default () => (
  (req, res, next) => {
    if (privateKeys.includes(req.url.split('/')[1])) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/auth/signin');
    } else {
      return next();
    }
  }
)