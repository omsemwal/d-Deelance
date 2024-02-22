const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    projectAttributes: [{ type: String }],
    keywords: [{ type: String }],
    pricingTitle: { type: String },
    description: { type: String, required: true },
    deliveryDays: { type: Number, required: true },
    numberOfPagesOrScreens: { type: Number },
    price: { type: Number, required: true },
    serviceOptions: [{ type: String }],
    packageDescription: { type: String },
    question: { type: String },
    images: [{ type: String }],
    externalLink: { type: String },
    socialLinks: [{ type: String }],
    projectAttributes: [{ type: String }],
    keywords: [{ type: String }],
  });
  
  const Task = mongoose.model('Task', taskSchema);
  module.exports = Task;