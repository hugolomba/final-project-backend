const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const offerSchema = new Schema(
  {
    offerName: {
      type: String,
      required: [true, "Name of offer is required"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer Price is required"],
      trim: true,
    },
    expiration: {
      type: String,
    },
    offerImg: {
      type: String,
      // require: true,
    },
    company: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Offer = model("Offer", offerSchema);

module.exports = Offer;
