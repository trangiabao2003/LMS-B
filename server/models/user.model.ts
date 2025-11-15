import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: {
		public_id: string;
		url: string;
	};
	role: string;
	isVerified: boolean;
	courses: Array<{ courseId: string }>;
	comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Vui lòng nhập tên của bạn"],
		},
		email: {
			type: String,
			required: [true, "Vui lòng nhập email của bạn"],
			validate: {
				validator: function (value: string) {
					return emailRegexPattern.test(value);
				},
				message: "Vui lòng nhập email hợp lệ",
			},
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Vui lòng nhập mật khẩu của bạn"],
			minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
			select: false,
		},
		avatar: {
			public_id: String,
			url: String,
		},
		role: {
			type: String,
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		courses: [
			{
				courseId: String,
			},
		],
	},
	{ timestamps: true }
);

//hash password before saving
userSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

//compare password
userSchema.methods.comparePassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;
