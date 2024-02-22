const mongoose= require("mongoose")

const bonusSchema = new mongoose.Schema({
    title: { type: String, required: true },
    points: { type: Number, required: true },
});

module.exports = mongoose.model('Bonus', bonusSchema);
