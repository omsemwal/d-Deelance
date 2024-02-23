

const mongoose = require("mongoose");
// const Experience = require("../model/exprienceModel"); // Import Experience model

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     wallet: String,
//     FullName: { type: String, required: true },
//     verified: { type: Boolean, default: true },
//     verificationToken: String,
//     registrationDate: { type: Date, default: Date.now },
//     isPrivate: { type: Boolean, default: false },
//     bonuses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bonus" }],
//     points: { type: Number, default: 0 },
//     title: { type: String, default: "Your Title" },
//     description: { type: String, default: "Set your description here!" },
//     country: String,
//     kind: { type: Number, default: 0 },
//     referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     education: [
//         {
//             school: String,
//             degree: String,
//             fieldOfStudy: String,
//             startMonth: String,
//             startYear: String,
//             endMonth: String,
//             endYear: String,
//             description: String,
//         },
//     ],
//     experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }], // Reference Experience model
//     otherDetails: Object,
// });

// userSchema.add({
//     selectSubscription: {
//         type: String,
//         enum: ["general", "premium", "pro"],
//         default: "general",
//     },
//     metaverseId: String,
// });



const experienceSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  location: String,
  locationType: String,
  employementType: String,
  currentlyWorkingHere: Boolean,
  startDate: String,
  startYear: Number,
  endDate: String,
  endYear: Number
});

const otherDetailsSchema = new mongoose.Schema({
  timeZone: {
    region: String,
    timeZone: String
  },
  payment: String,
  language: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: { type: String },
    FullName: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    registrationDate: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false },
    bonuses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bonus' }],
    points: { type: Number, default: 0 },
    title: { type: String, default: 'Your Title' },
    description: { type: String, default: 'Set your description here!' },
    skills: [{ type: String }],
    country: { type: String },
    token:{type:String},
    kind: {type: Number, default: 0},
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    skills: [{ code: String, label: String }],
    education: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      startMonth: String,
      startYear: String,
      endMonth: String,
      endYear: String,
      description: String,
    }],
    experience: [experienceSchema],
    otherDetails: otherDetailsSchema,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
//module.exports = mongoose.model("User", userSchema);
