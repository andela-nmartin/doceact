// require the modules for database and password
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

// create a schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  name: {
    first: String,
    last: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', (next) => {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = (password) => {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// make the model available to our users in our Node applications
export default mongoose.model('User', UserSchema);
