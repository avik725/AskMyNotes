import { Conversations } from "../models/conversations.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";
import * as chatService from "../services/chat.service.js";
import redisConnection from "../config/redis.js";
import { CHAT_TTL, REDIS_STORE_PREFIX } from "../constants.js";
import { chatWithRAGMODEL } from "../services/rag.service.js";
import { messagesQueue } from "../queues/messages.queue.js";
import { Messages } from "../models/messages.model.js";

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

  const conversation = await Conversations.findByIdAndUpdate(
    { _id: id, is_deleted: false },
    {
      $set: {
        allowed_sources: [...sources],
      },
    },
    { new: true }
  ).select("title allowed_sources private_notes_allowed summary");

  const alreadyConnected = await redisConnection.exists(
    `${REDIS_STORE_PREFIX}:${conversation._id}:session`
  );
  if (alreadyConnected) {
    await redisConnection.set(
      `${REDIS_STORE_PREFIX}:${conversation._id}:settings`,
      JSON.stringify({
        allowed_sources: conversation.allowed_sources || [],
        private_notes_allowed: conversation.private_notes_allowed || false,
      }),
      "EX",
      1800
    );
  }

  if (!conversation.matchedCount === 0) {
    throw new apiError(400, "Invalid Conversation Id !!");
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

const getConversationMessages = asyncHandler(async (req, res, next) => {
  const { conversation_id } = req?.params;

  if (!conversation_id) {
    throw new apiError(400, "Conversation Id is Required to Fetch Messages !!");
  }

  const messages = await Messages.find({
    conversation_id,
  })
    .sort({ createdAt: 1 })
    .select("role content");

  if (!(messages.length > 0)) {
    throw new apiError(404, "No Messages found for the conversation");
  }

  return res
    .status(200)
    .json(new apiResponse(200, messages, "Messages fetched Successfully !!"));
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

const chat = asyncHandler(async (req, res, next) => {
  const { conversation_id } = req.params;
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    throw new apiError(400, "Query is Required !!");
  }
  const alreadyConnected = await redisConnection.exists(
    `ai:chat:${conversation_id}:session`
  );
  // if (!Number(alreadyConnected)) {
  //   throw new apiError(400, "Conversation Not Connected or Session expired !!");
  // }

  const summary = await redisConnection.get(
    `${REDIS_STORE_PREFIX}:${conversation_id}:summary`
  );

  const rawMessages = await redisConnection.lrange(
    `${REDIS_STORE_PREFIX}:${conversation_id}:messages`,
    0,
    -1
  );

  const messages = rawMessages ? rawMessages.map((msg) => JSON.parse(msg)) : [];

  const settings = await redisConnection.get(
    `${REDIS_STORE_PREFIX}:${conversation_id}:settings`
  );

  await redisConnection.rpush(
    `${REDIS_STORE_PREFIX}:${conversation_id}:messages`,
    JSON.stringify({
      role: "user",
      content: query,
    })
  );

  await messagesQueue.add("store-messages", {
    conversation_id,
    role: "user",
    content: query,
  });

  const response = await chatWithRAGMODEL({
    conversationId: conversation_id,
    ...(summary && { summary: summary }),
    ...(messages.length > 0 && { messages }),
    allowed_sources: JSON.parse(settings)?.allowed_sources,
    private_notes_allowed: JSON.parse(settings)?.private_notes_allowed,
    user_query: query,
  });

  await redisConnection.rpush(
    `${REDIS_STORE_PREFIX}:${conversation_id}:messages`,
    JSON.stringify({
      role: "assistant",
      content: response.message,
    })
  );

  await redisConnection.expire(
    `${REDIS_STORE_PREFIX}:${conversation_id}:messages`,
    CHAT_TTL
  );
  await redisConnection.expire(
    `${REDIS_STORE_PREFIX}:${conversation_id}:session`,
    CHAT_TTL
  );
  await redisConnection.expire(
    `${REDIS_STORE_PREFIX}:${conversation_id}:settings`,
    CHAT_TTL
  );
  await redisConnection.expire(
    `${REDIS_STORE_PREFIX}:${conversation_id}:summary`,
    CHAT_TTL
  );

  await messagesQueue.add("store-messages", {
    conversation_id,
    role: "assistant",
    content: response.message,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { response: response.message },
        "LLM Response request successfull !!"
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
  getConversationMessages,
  connectConversation,
  checkConversationConnection,
  disconnectConversation,
  chat,
};
