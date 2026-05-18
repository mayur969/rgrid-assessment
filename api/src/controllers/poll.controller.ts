import { Request, Response } from "express";
import { Poll } from "../schema/poll_schema";
import { Nominee } from "../schema/nominee_schema";
import { Types } from "mongoose";

export const createPoll = async (req: Request, res: Response) => {
    try {
        const { title, description, nominees, createdBy, } = req.body;

        const poll = await Poll.create({ title, description, createdBy, });

        const nomineeDocs = nominees.map((name: string) => ({
            pollId: poll._id,
            name,
        }));

        await Nominee.insertMany(nomineeDocs);

        res.status(201).json({ message: "Poll created", poll, });

    } catch (error) {
        res.status(500).json({ message: "Server error", });
    }
};

export const getPolls = async (req: Request, res: Response) => {
    try {
        const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
        const match: any = {};

        if (status) {
            match.status = status;
        }

        const polls = await Poll.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "nominees",
                    localField: "_id",
                    foreignField: "pollId",
                    as: "nominees",
                },
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    createdBy: 1,
                    totalVotes: 1,
                    maxNominees: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    nominees: 1,
                },
            },
        ]);

        res.json(polls);

    } catch (error) {
        res.status(500).json({ message: "Server error", });
    }
};

export const getSinglePoll = async (req: Request, res: Response) => {
    try {
        const pollId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!pollId || !Types.ObjectId.isValid(pollId)) {
            return res.status(400).json({
                message: "Invalid poll id",
            });
        }

        const poll = await Poll.findById(pollId);

        const nominees = await Nominee.find({
            pollId: new Types.ObjectId(pollId),
        });

        res.json({ poll, nominees });

    } catch (error) {
        res.status(500).json({ message: "Server error", });
    }
};

export const endPoll = async (req: Request, res: Response) => {
    try {
        const pollId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!pollId || !Types.ObjectId.isValid(pollId)) {
            return res.status(400).json({
                message: "Invalid poll id",
            });
        }

        const updatedPoll = await Poll.findByIdAndUpdate(
            pollId,
            { status: "ended" },
            { new: true }
        );

        if (!updatedPoll) {
            return res.status(404).json({
                message: "Poll not found",
            });
        }

        res.json({ message: "Poll ended successfully", poll: updatedPoll });

    } catch (error) {
        res.status(500).json({ message: "Server error", });
    }
};