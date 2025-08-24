import express from 'express';
import Form from '../models/Form.js';

const router = express.Router();

// Create form
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) return res.status(400).json({ message: 'title is required' });
    const form = new Form(body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// List forms
router.get('/', async (_req, res) => {
  try {
    const forms = await Form.find().sort({ updatedAt: -1 }).lean();
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get form by id
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).lean();
    if (!form) return res.status(404).json({ message: 'Not found' });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Duplicate form
router.post('/:id/duplicate', async (req, res) => {
  try {
    const existing = await Form.findById(req.params.id).lean();
    if (!existing) return res.status(404).json({ message: 'Not found' });
    delete existing._id;
    existing.title = existing.title + ' (Copy)';
    existing.isPublished = false;
    const copy = new Form(existing);
    await copy.save();
    res.status(201).json(copy);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
