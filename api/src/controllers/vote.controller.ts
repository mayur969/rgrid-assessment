import { Request, Response } from "express";
import { Poll } from "../schema/poll_schema";
import { Vote } from "../schema/votes_schema";
import { Nominee } from "../schema/nominee_schema";
import { io } from "../sockets";
import { votePollSchema } from "../validations/vote.validation";
import { z } from "zod";

export const votePoll = async (req: Request, res: Response) => {
  try {
    const validatedData = votePollSchema.parse(req.body);

    const { pollId, nomineeId } = validatedData;

    const sessionId = req.sessionID;

    const [poll, nominee] = await Promise.all([
      Poll.findById(pollId).select("status _id totalVotes"),
      Nominee.findOne({ _id: nomineeId, pollId, }).select("_id"),
    ]);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found", });
    }

    if (poll.status !== "active") {
      return res.status(400).json({ message: "Poll is not active", });
    }

    if (!nominee) {
      return res.status(400).json({ message: "Nominee not found in this poll", });
    }

    try {
      await Vote.create({
        pollId,
        nomineeId,
        sessionId,
      });
    } catch (err: any) {

      if (
        err &&
        err.code === 11000
      ) {
        return res.status(400).json({ message: "Already voted", });
      }

      throw err;
    }

    const [updatedPoll] = await Promise.all([
      Poll.findByIdAndUpdate(
        pollId,
        {
          $inc: {
            totalVotes: 1,
          },
        },
        {
          new: true,
        }
      ).select(
        "totalVotes _id"
      ),

      Nominee.findByIdAndUpdate(
        nomineeId,
        {
          $inc: {
            voteCount: 1,
          },
        }
      ),
    ]);

    const nominees = await Nominee.find({ pollId, }).select("_id name voteCount");

    if (io) {
      io.emit("vote-updated", { pollId, totalVotes: updatedPoll?.totalVotes ?? 0, nominees, });
    }

    res.status(200).json({ message: "Vote submitted successfully", });

  } catch (error: any) {

    
    if (error instanceof z.ZodError) {
      const flattened = z.flattenError(error);

      return res.status(400).json({ message: "Validation failed", errors: flattened.fieldErrors, });
    }

    res.status(500).json({ message: "Server error", });
  }
};
