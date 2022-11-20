// models/User.model.js

const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minLength: 4,
      lowercase: true,
      trim: true,
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
      String,
      // {
      //   street: "String",
      //   number: "Number",
      //   district: "String",
      //   zipCode: "number", // colocar algo para validar automaticamente
      //   city: "String",
      //   state: "String",
      // },
    ],
    category: [],
    subcategory: [],
    coverImg: {
      type: "String",
      default: "",
    }, //cloudnary, // ??????
    profileImg: {
      type: "String",
      default:
        "https://raw.githubusercontent.com/hugolomba/final-project-backend/main/img/default-profile.png",
    }, //cloudnary
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    services: [],
    description: String,
    offers: [],
    type: { type: "String", default: "company" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model("Company", companySchema);
