const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },

  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  avatar: { 
    type: String, 
    default: '' 
  },

  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Coin' 
  }],

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// BUG FIX: bcryptjs v3 dropped the next() callback — use pure async, no next param
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);