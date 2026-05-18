import mongoose, { Schema, Types } from "mongoose";

export interface INominee extends Document {
  pollId: mongoose.Types.ObjectId;

  name: string;

  voteCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const NomineeSchema = new Schema<INominee>({
    pollId: {
        type: Types.ObjectId,
        ref: "Poll"
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    voteCount: {
        type: Number,
        default: 0,
        min: 0,
    }
}, {
    timestamps: true
});

NomineeSchema.index(
  {
    pollId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const Nominee = mongoose.model<INominee>("Nominee", NomineeSchema);