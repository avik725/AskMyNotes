import { Conversations } from "../models/conversations.model.js";
import { Messages } from "../models/messages.model.js";
import redis from "../databases/redis.js";
import { apiError } from "../utilities/apiError.js";

const CHAT_TTL = 60 * 30; // 30 minutes
const CONTEXT_LIMIT = 8;

export const connectChat = async ({ userId, conversationId }) => {
  const prefix = `askai:chat:${conversationId}`;

  // 1️⃣ Validate conversation ownership
  const conversation = await Conversations.findOne({
    _id: conversationId,
    user_id: userId,
  }).lean();

  if (!conversation) {
    throw new apiError(400, "Conversation not found or access denied");
  }

  // 2️⃣ Check if already connected (avoid re-hydration)
  const alreadyConnected = await redis.exists(`${prefix}:session`);
  if (alreadyConnected) {
    return { connected: true, cached: true };
  }

  // 3️⃣ Fetch last N messages from DB
  const messages = await Messages.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(CONTEXT_LIMIT)
    .lean();

  // 4️⃣ SESSION key (single source of truth)
  await redis.set(`${prefix}:session`, "1", "EX", CHAT_TTL);

  // 5️⃣ MESSAGES list
  if (messages.length > 0) {
    await redis.del(`${prefix}:messages`);

    for (const msg of messages.reverse()) {
      await redis.rpush(
        `${prefix}:messages`,
        JSON.stringify({
          role: msg.role,
          content: msg.content,
        })
      );
    }

    await redis.expire(`${prefix}:messages`, CHAT_TTL);
  }

  // 6️⃣ SUMMARY (if exists)
  if (conversation.summary) {
    await redis.set(`${prefix}:summary`, conversation.summary, "EX", CHAT_TTL);
  }

  // 7️⃣ CHAT SETTINGS (RAG controls)
  await redis.set(
    `${prefix}:settings`,
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

  const alreadyConnected = await redis.exists(`${prefix}:session`);

  if (alreadyConnected) {
    return { connected: true, cached: true };
  }

  return { connected: false };
};

export const disconnectChat = async (conversationId) => {
  const prefix = `askai:chat:${conversationId}`;

  const alreadyConnected = await redis.exists(`${prefix}:session`);

  if (!alreadyConnected) {
    return {
      success: true,
      message: "Conversation Disconnected Successfully !!",
    };
  }

  try {
    await redis.del(`${prefix}:session`);
    await redis.del(`${prefix}:messages`);
    await redis.del(`${prefix}:summary`);
    await redis.del(`${prefix}:settings`);
  } catch (error) {
    throw new apiError(500, "Something Went Wrong !!", error);
  }

  return {
    success: true,
    message: "Conversation Disconnected Successfully !!",
  };
};
