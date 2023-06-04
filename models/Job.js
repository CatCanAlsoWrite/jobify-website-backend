import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending',
    }, //`use 'enum'/enumeration to set options`
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      required: true,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, 'please provide user'],
      ref: 'User',
    }, //`use 'ref' to find data in model 'User' in mongoose, use 'mongoose.Types.ObjectId' to find data '_id' in reference/User model`
  },
  { timestamps: true } //`mongoose will set 'createdAt' time when the document is first inserted, and update 'updatedAt' time whenever you update the document using 'save()', 'updateOne()', 'updateMany()', 'findOneAndUpdate()', 'update()', 'replaceOne()', or 'bulkWrite()'.`
)
export default mongoose.model('Job', JobSchema)
