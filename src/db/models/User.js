import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    index: {
      unique: true,
    },
    required: true,
  },
  password: {
    type: String,
  },
  displayName: {
    type: String,
    required: true,
  },
  twitchId: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: String,
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.password) return;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  if (!this.password) return;
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};


export default mongoose.model('User', userSchema);
