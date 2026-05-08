import mongoose, { Schema, Document } from 'mongoose';

export enum CandidateStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
}

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CandidateStatus),
      default: CandidateStatus.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Filter out deleted candidates by default
CandidateSchema.pre(/^find/, function (this: any) {
  this.where({ isDeleted: false });
});

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
