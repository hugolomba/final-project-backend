// models/User.model.js

const { Schema, model } = require("mongoose");

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
    addresses: [
      {
        street: "String",
        number: "Number",
        district: "String",
        zipCode: "number", // colocar algo para validar automaticamente
        city: "String",
        state: "String",
      },
    ],
    category: [],
    subcategory: [],
    coverImg: {
      type: "String",
      default: "",
    }, //cloudnary, // ??????
    profileImg: {
      type: "String",
      default: "",
    }, //cloudnary
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    services: [],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
