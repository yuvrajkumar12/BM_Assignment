import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const FieldSchema = new mongoose.Schema({
  id: { type: String, required: true }, // client-generated id
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text','textarea','number','email','date','select','radio','checkbox','checkbox-group'],
    required: true
  },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  helperText: { type: String, default: '' },
  options: { type: [OptionSchema], default: [] },
  width: { type: String, default: 'full' }, // full | half | third
  order: { type: Number, default: 0 }
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  theme: {
    primary: { type: String, default: '#2563eb' },
    font: { type: String, default: 'system-ui' }
  },
  fields: { type: [FieldSchema], default: [] },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Form', FormSchema);
