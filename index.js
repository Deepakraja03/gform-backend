const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const formSubmissionSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  date: Date,
  time: String,
  mode: String,
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

app.post('/api/submit-form', async (req, res) => {
  const { email, name, phone, date, time, mode } = req.body;
  try {
    const newFormSubmission = new FormSubmission({
      email,
      name,
      phone,
      date,
      time,
      mode
    });
    console.log(email);
    await newFormSubmission.save();

    await Slot.updateOne({ date, time, mode }, { isBooked: true });

    res.status(201).json({ message: 'Form submitted and slot booked successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
