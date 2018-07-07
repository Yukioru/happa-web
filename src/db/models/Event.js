import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['day', 'evening', 'dayoff'],
    default: 'day',
  },
  startTime: {
    type: Date,
  },
  finishTime: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
});

export default mongoose.model('Event', eventSchema);
