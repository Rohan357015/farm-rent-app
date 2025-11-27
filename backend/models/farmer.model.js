import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    
    phone: { type: String },
    location: { type: String },
    landSize: { type: Number }, 
    role: { type: String, default: "farmer" },
    rentals: { type :Number, default:0},
    ratings: { type: [Number], default: [] },
    activerentals: { type :Number, default:0},  
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
