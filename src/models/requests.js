const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum : {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {
    timestamps: true
});

requestSchema.pre('save', function () {
    const isRequestYourself = this.fromUserId?.equals(this.toUserId);
    if(isRequestYourself) {
        throw new Error('Request yourself not allowed!');
    }
});

requestSchema.index({ fromUserId: 1, toUserId: 1});

const ConnectionRequest = mongoose.model("ConnectionRequest", requestSchema);

module.exports = ConnectionRequest;