import { Conversations } from "../models/conversations.model.js";
import { Messages } from "../models/messages.model.js";
import redisConnection from "../config/redis.js";
import { apiError } from "../utilities/apiError.js";
import {
  REDIS_STORE_PREFIX,
  CHAT_TTL,
  RAG_CONTEXT_LIMIT,
} from "../constants.js";

export const connectChat = async ({ userId, conversationId }) => {
  const conversation = await Conversations.findOne({
    _id: conversationId,
    user_id: userId,
  }).lean();

  if (!conversation) {
    throw new apiError(400, "Conversation not found or access denied");
  }

  const alreadyConnected = await redisConnection.exists(
    `${REDIS_STORE_PREFIX}:${conversationId}:session`
  );
  if (alreadyConnected) {
    return { connected: true, cached: true };
  }

  const messages = await Messages.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(RAG_CONTEXT_LIMIT)
    .lean();

  await redisConnection.set(
    `${REDIS_STORE_PREFIX}:${conversationId}:session`,
    "1",
    "EX",
    CHAT_TTL
  );

  if (messages.length > 0) {
    await redisConnection.del(
      `${REDIS_STORE_PREFIX}:${conversationId}:messages`
    );

    for (const msg of messages.reverse()) {
      await redisConnection.rpush(
        `${REDIS_STORE_PREFIX}:${conversationId}:messages`,
        JSON.stringify({
          role: msg.role,
          content: msg.content,
        })
      );
    }

    await redisConnection.expire(
      `${REDIS_STORE_PREFIX}:${conversationId}:messages`,
      CHAT_TTL
    );
  }

  if (conversation.summary) {
    await redisConnection.set(
      `${REDIS_STORE_PREFIX}:${conversationId}:summary`,
      conversation.summary,
      "EX",
      CHAT_TTL
    );
  }

  await redisConnection.set(
    `${REDIS_STORE_PREFIX}:${conversationId}:settings`,
    JSON.stringify({
      allowed_sources: conversation.allowed_sources || [],
      private_notes_allowed: conversation.private_notes_allowed || false,
    }),
    "EX",
    CHAT_TTL
  );

  return {
    connected: true,
    cached: false,
  };
};

export const checkIfConnected = async ({ userId, conversationId }) => {
  const prefix = `askai:chat:${conversationId}`;

  const alreadyConnected = await redisConnection.exists(`${prefix}:session`);

  if (alreadyConnected) {
    return { connected: true, cached: true };
  }

  return { connected: false };
};

export const disconnectChat = async (conversationId) => {
  const prefix = `askai:chat:${conversationId}`;

  const alreadyConnected = await redisConnection.exists(`${prefix}:session`);

  if (!alreadyConnected) {
    return {
      success: true,
      message: "Conversation Disconnected Successfully !!",
    };
  }

  try {
    await redisConnection.del(`${prefix}:session`);
    await redisConnection.del(`${prefix}:messages`);
    await redisConnection.del(`${prefix}:summary`);
    await redisConnection.del(`${prefix}:settings`);
  } catch (error) {
    throw new apiError(500, "Something Went Wrong !!", error);
  }

  return {
    success: true,
    message: "Conversation Disconnected Successfully !!",
  };
};

export const storeMessages = async ({ conversation_id, role, content }) => {
  if (!conversation_id) {
    throw new apiError(400, "conversation_id is required to store messages !!");
  }

  if (!role) {
    throw new apiError(400, "role is required to store messages !!");
  }

  const storedMessage = Messages.create({
    conversation_id,
    role,
    content: content || "",
  });

  if (!storedMessage) {
    throw new apiError(500, "Internal Server error while storing messages !!");
  }

  return;
};
