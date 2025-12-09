"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên của bạn"],
    },
    email: {
        type: String,
        required: [true, "Vui lòng nhập email của bạn"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: "Vui lòng nhập email hợp lệ",
        },
        unique: true,
    },
    password: {
        type: String,
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
}, { timestamps: true });
//hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
//sign access token
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "5m",
    });
};
//sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: "3d",
    });
};
//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
