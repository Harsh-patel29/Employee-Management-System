import mongoose, { Schema } from 'mongoose';

const SMTPSchema = new Schema(
  {
    Host: {
      type: String,
      required: true,
    },
    Port: {
      type: String,
      required: true,
    },
    User_Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    From_Name: {
      type: String,
      required: true,
    },
    Email_From: {
      type: String,
      required: true,
    },
    BBC_Email: {
      type: Array,
      required: true,
    },
    Attendance: {
      type: Object,
      required: true,
    },
  },

  { timestamps: true }
);

export const SMTP = mongoose.model('SMTP', SMTPSchema);
