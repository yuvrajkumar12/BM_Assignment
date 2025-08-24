import express from 'express';
import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { toCSV } from '../utils/csv.js';

const router = express.Router();

// Submit response for formId
router.post('/:formId', async (req, res) => {
  try {
    const formId = req.params.formId;
    const form = await Form.findById(formId).lean();
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    const r = new Response({
      formId,
      answers,
      userAgent: req.get('user-agent') || ''
    });
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// List responses for a form
router.get('/:formId', async (req, res) => {
  try {
    const items = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Download CSV for a form
router.get('/:formId/csv', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).lean();
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const responses = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 }).lean();

    const labelMap = new Map((form.fields || []).map(f => [f.id, f.label]));
    const rows = responses.map(r => {
      const row = { _id: r._id.toString(), createdAt: r.createdAt.toISOString() };
      for (const a of r.answers || []) {
        const key = labelMap.get(a.fieldId) || a.fieldId;
        row[key] = Array.isArray(a.value) ? a.value.join('; ') : a.value;
      }
      return row;
    });

    const csv = toCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="form_${form._id}_responses.csv"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
