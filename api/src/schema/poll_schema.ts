import mongoose, { Schema, Types } from "mongoose";

export interface IPoll extends Document {
    title: string;

    description?: string;

    status: "active" | "ended";

    createdBy: mongoose.Types.ObjectId;

    totalVotes: number;

    maxNominees: number;

    createdAt: Date;
    updatedAt: Date;
}

const PollSchema = new Schema<IPoll>({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    status: {
        type: String,
        enum: ["active", "ended"],
        default: "active",
        index: true,
    },

    createdBy: {
        type: Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    totalVotes: {
        type: Number,
        default: 0,
        min: 0,
    },

    maxNominees: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
}, {
    timestamps: true
});

PollSchema.index({
    status: 1,
    createdAt: -1,
});


export const Poll = mongoose.model<IPoll>("Poll", PollSchema)