import mongoose, { Schema } from "mongoose";

export interface IAdmin extends Document {
    username: string;

    password: string;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

}, {
    timestamps: true
});

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema)