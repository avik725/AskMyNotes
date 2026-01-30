import { Conversations } from "../models/conversations.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";

const createConversationNotebook = asyncHandler(async (req, res, next) => {
  const { sources } = req.body;

  if (sources && sources.isArray()) {
    sources = JSON.parse(sources);
  }
  const conversation = await Conversations.create({
    user_id: req.user?._id,
    ...(sources && { allowed_sources: sources }),
  });

  if (!conversation) {
    throw new apiError(500, "Internal Server Error !!");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        201,
        conversation,
        "Conversation Notebook Created Successfully !!"
      )
    );
});

const getUserConversations = asyncHandler(async (req, res, next) => {
  const conversationRecords = await Conversations.find({
    user_id: req.user?._id,
  });

  if (!conversationRecords) {
    throw new apiError(500, "Internal Server Error !!");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        conversationRecords,
        "Conversations Fetched Successfully !!"
      )
    );
});

const deleteConversations = asyncHandler(async (req, res, next) => {
  const { id } = req?.params;

  if (!id) {
    throw new apiError(400, "Conversation Id is Required !!");
  }

  const result = await Conversations.softDeleteById(id);

  if (result.matchedCount === 0) {
    throw new apiError(404, "Conversation not found or already deleted !!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Conversation deleted successfully !!"));
});

export { createConversationNotebook, getUserConversations, deleteConversations };
