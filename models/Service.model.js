const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const serviceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Name of service is required"],
    },
    servicePrice: {
      type: Number,
      required: [true, "Service Price is required"],
      trim: true,
    },

    serviceImg: {
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

const Service = model("Service", serviceSchema);

module.exports = Service;
