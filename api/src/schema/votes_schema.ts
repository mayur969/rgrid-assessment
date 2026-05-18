import mongoose, { Schema, Types } from "mongoose";

export interface IVote extends Document {
    pollId: mongoose.Types.ObjectId;

    nomineeId: mongoose.Types.ObjectId;

    sessionId: string;

    votedAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const VoteSchema = new Schema<IVote>({
    pollId: {
        type: Types.ObjectId,
        ref: "Poll",
        required: true,
        index: true,
    },

    nomineeId: {
        type: Types.ObjectId,
        ref: "Nominee",
        required: true
    },

    sessionId: {
        type: String,
        required: true
    },

    votedAt: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true,
    }
);

VoteSchema.index(
    { pollId: 1, sessionId: 1 },
    { unique: true }
);

VoteSchema.index({
  nomineeId: 1,
  votedAt: -1,
});

export const Vote = mongoose.model<IVote>("Vote", VoteSchema)

