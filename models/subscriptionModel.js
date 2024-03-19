const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    price: {
        type: String,
        required: [true, "Please enter price of plan"],
    },
    audioQuality: {
        type: String,
        required: [true, "Please enter audio quality of plan"],
    },
    videoQuality: {
        type: String,
        required: [true, "Please enter video quality of plan"],
    },
    deviceTypesAllowed: {
        type: String,
        required: [true, "Please enter types of devices allowed in plan"],
    },
    maxDevicesAllowed: {
        type: String,
        required: [true, "Please enter maximum devices accessible in plan"],
    }

},
{
    timestamps: true,
});

const subscriptionModel = mongoose.model('SubscriptionPlans', subscriptionSchema);

module.exports = subscriptionModel;