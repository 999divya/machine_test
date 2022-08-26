const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  mobile: {
    type: [String],
    required: [true, "Mobile number is required"],
    unique: true,
  },
  image: {
    type: Array,
    required: [true, "Contact image is required"]
  },
},{timestamps:true});

module.exports = mongoose.model("Contact", contactSchema);
