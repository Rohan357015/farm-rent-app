import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    companyName: { type: String },
    phone: { type: String },
    location: { type: String },
    about :{type:String},
    ratings:{type:String},
    gender:{
       type: String,
    enum: ["Male","Female"]
    },
    equipmentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    role: { type: String, default: "supplier" },
     Address: {
      street: { type: String },
      city: { type: String},
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
      alternatePhone: { type: String },
      landmark: {type:String},
    },
    image:{type:String},
  },
  
  { timestamps: true }
);

supplierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

supplierSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
