import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const slotSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
});

const tutorSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    subjects:{
        type: [String],
        required: true
    },
    slots: [slotSchema]
});

const Tutor = mongoose.model('Tutor', tutorSchema);

export default Tutor;