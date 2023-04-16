import mongoose, { Schema, model, models } from 'mongoose';
import { IAnswer } from '../interface';
import moment from 'moment';
let now = moment().format("LLL");
mongoose.Promise = global.Promise;

const AnswerSchema: Schema = new Schema({
    body: { type: String, required: true },
    author: {
        type: {
            id: { type: String, required: true },
            password: String,
            fname: String,
            lname: String,
            email: String,
            role: String,
            bio: String,
            country: String,
            phone: String,
            Answeral_code: String,
            street_address: String,
            city: String,
            state: String,
            website: String
        }
        , required: true
    },
    post:{type: String, required: true},
    isSolution: {type: Boolean, default: false, required: true},
    time: { type: String, default: now },
    upvotes: Array<String>,
    downvotes: Array<String>,
});
try {
    delete models.Answer
} catch (err) {
    console.log(err);
}
const Answer = model<IAnswer>('Answer', AnswerSchema);

export default Answer; 