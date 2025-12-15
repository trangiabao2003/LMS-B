require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	sources?: any[];
}

export interface IChatHistory extends Document {
	userId: string;
	messages: IMessage[];
	courseId?: string;
	sessionId: string;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
	role: {
		type: String,
		enum: ["user", "assistant"],
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	sources: {
		type: Schema.Types.Mixed,
		default: [],
	},
});

const chatHistorySchema: Schema<IChatHistory> = new Schema(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},
		messages: {
			type: [messageSchema],
			default: [],
		},
		courseId: {
			type: String,
			default: null,
		},
		sessionId: {
			type: String,
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// Index for querying user's chat history
chatHistorySchema.index({ userId: 1, createdAt: -1 });

const ChatHistoryModel: Model<IChatHistory> = mongoose.model(
	"ChatHistory",
	chatHistorySchema
);

export default ChatHistoryModel;
