import { Conversations } from "../models/conversations.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";
import * as chatService from "../services/chat.service.js";

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

const getConversationById = asyncHandler(async (req, res, next) => {
  const { id } = req?.params;

  if (!id) {
    throw new apiError(400, "Conversation Id is required !!");
  }

  const conversation = await Conversations.findById(id);

  if (!conversation) {
    throw new apiError(404, "Conversation Not Found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, conversation, "Conversation Fetched Successfully !!")
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

const updateConversationSources = asyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { sources } = req?.body;

  if (!id) {
    throw new apiError(400, "Conversation Id is Required !!");
  }

  if (!sources) {
    throw new apiError(400, "Sources are required !!");
  }

  const conversation = await Conversations.updateOne(
    { _id: id, is_deleted: false },
    {
      $set: {
        allowed_sources: [...sources],
      },
    },
    { new: true }
  );

  if (!conversation) {
    throw new apiError(500, "Something went Wrong while updating sources !!");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, conversation, "Sources Updated Successfully !!")
    );
});

const updateConversationTitle = asyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { title } = req?.body;

  if (!id) {
    throw new apiError(400, "Conversation Id is Required !!");
  }

  if (!title || title.trim() === "") {
    throw new apiError(400, "Title is required !!");
  }

  const conversation = await Conversations.findOneAndUpdate(
    { _id: id, is_deleted: false, user_id: req.user?._id },
    {
      $set: {
        title: title.trim(),
      },
    },
    { new: true }
  );

  if (!conversation) {
    throw new apiError(404, "Conversation not found or unauthorized !!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, conversation, "Title Updated Successfully !!"));
});

const connectConversation = asyncHandler(async (req, res, next) => {
  await chatService.connectChat({
    userId: req.user?.id,
    conversationId: req.params.id,
  });

  res.json({ success: true, connected: true });
});

const checkConversationConnection = asyncHandler(async (req, res, next) => {
  const result = await chatService.checkIfConnected({
    userId: req.user?.id,
    conversationId: req.params?.id,
  });

  if (!result.connected) {
    res.status(200).json(new apiResponse(200, result, "Not Connected !!"));
  }

  res.status(200).json(new apiResponse(200, result, "Connected Successfully"));
});

const disconnectConversation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log("id : ", id);

  if (!id) {
    throw new apiError(400, "Conversation Id required !!");
  }
  const result = await chatService.disconnectChat(id);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        null,
        result.message || "Disconnected Successfully !!"
      )
    );
});

export {
  createConversationNotebook,
  getUserConversations,
  deleteConversations,
  getConversationById,
  updateConversationSources,
  updateConversationTitle,
  connectConversation,
  checkConversationConnection,
  disconnectConversation,
};
