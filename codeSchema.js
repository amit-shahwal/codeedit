const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const codeSaveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: 32,
      trim: true,
      //   required: true,
    },

    code: {
      type: [String],

      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("codes", codeSaveSchema);
