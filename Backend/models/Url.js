const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
shortId: { type: String, required: true, unique: true },
originalUrl: { type: String, required: true },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
clicks: { type: Number, default: 0 },
isActive: { type: Boolean, default: true },
customAlias: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now },
expiresAt: { type: Date, default: null }
});


// Optional: TTL index if you want automatic deletion after expiresAt
// urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('Url', urlSchema);