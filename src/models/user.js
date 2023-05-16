
const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    default: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("Age Must Be a Positive Number!")
      }
    }
  },
  city: {
    type: String
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(val) {
      const password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
      if (!password.test(val)) {
        throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")

      }
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Email Is INVALID")
      }
    }
  },

  tokens: [{
    type: String,
    required: true
  }]
})
///////////
userSchema.pre("save", async function () {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 10)
  }
})
///////////
 
userSchema.statics.findByCredentials = async (em, pass) => {

  const user = await User.findOne({ email: em })
  if (!user) {
    throw new Error("Error, Check Your Email or Password!")
  }

  const isMatch = await bcryptjs.compare(pass, user.password)

  if (!isMatch) {
    throw new Error("Error, Check Your Email or Password!")
  }

  return user
}

////////

userSchema.methods.generateToken = async function () {
  const user = this

  const token = jwt.sign({ _id: user._id.toString() }, "hana")

  user.tokens = user.tokens.concat(token)

  await user.save()

  return token
}

/////////////    Private Data
      

userSchema.methods.toJSON = function () {
  const user = this

  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}



const User = mongoose.model("User", userSchema)


module.exports = User