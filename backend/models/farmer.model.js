import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const farmerRatingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { _id: false, timestamps: true }
);

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    image :{type:String},
    gender:{
       type: String,
    enum: ["Male","Female"]
    },

    phone: { type: String },
    location: { type: String },
    landSize: { type: Number },
    role: { type: String, default: "farmer" },
    rentals: { type: Number, default: 0 },
    ratings: {
      type: [farmerRatingSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    activerentals: { type: Number, default: 0 },
    about: { type: String },
    Address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
      alternatePhone: { type: String },
      landmark: {type:String},
    },
    
  },
  { timestamps: true }
);

farmerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

farmerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
