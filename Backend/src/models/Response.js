import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed } // string, boolean, array etc.
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: { type: [AnswerSchema], default: [] },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Response', ResponseSchema);
