const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
    },
    addresses: { type: String },
    // [
    //   {
    //     street: "String",
    //     number: "Number",
    //     district: "String",
    //     zipCode: "number", // colocar algo para validar automaticamente
    //     city: "String",
    //     state: "String",
    //   },
    // ],
    birthDate: "Date", // ??????
    profileImg: {
      type: "String",
      default: "",
    }, //cloudnary
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
