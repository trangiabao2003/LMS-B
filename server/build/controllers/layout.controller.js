"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
//create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await layout_model_1.default.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler_1.default(`${type} already exist`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await layout_model_1.default.create(banner);
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await layout_model_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            let bannerData = await layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            // Nếu chưa có Banner, tạo mới
            if (!bannerData) {
                const banner = {
                    type: "Banner",
                    banner: {
                        title,
                        subTitle,
                    },
                };
                // Upload ảnh nếu có
                if (image && image.startsWith('data:image')) {
                    const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                        folder: "layout",
                    });
                    banner.banner.image = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    };
                }
                await layout_model_1.default.create(banner);
            }
            else {
                // Update Banner đã tồn tại
                // Chỉ xóa ảnh cũ nếu có ảnh mới và ảnh mới khác ảnh cũ
                if (image && bannerData.banner?.image?.public_id &&
                    image !== bannerData.banner.image.url) {
                    try {
                        await cloudinary_1.default.v2.uploader.destroy(bannerData.banner.image.public_id);
                    }
                    catch (error) {
                        console.log("Error deleting old image:", error);
                    }
                }
                const banner = {
                    title,
                    subTitle,
                };
                // Chỉ upload ảnh mới nếu image là base64 (ảnh mới)
                if (image && image.startsWith('data:image')) {
                    const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                        folder: "layout",
                    });
                    banner.image = {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    };
                }
                else if (image) {
                    // Giữ nguyên ảnh cũ
                    banner.image = bannerData.banner.image;
                }
                await layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner }, { new: true });
            }
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const FaqItem = await layout_model_1.default.findOne({ type: "FAQ" });
            if (!FaqItem) {
                return next(new ErrorHandler_1.default("FAQ layout not found", 404));
            }
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            await layout_model_1.default.findByIdAndUpdate(FaqItem._id, {
                type: "FAQ",
                faq: faqItems,
            }, { new: true });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = await layout_model_1.default.findOne({
                type: "Categories",
            });
            if (!categoriesData) {
                return next(new ErrorHandler_1.default("Categories layout not found", 404));
            }
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            await layout_model_1.default.findByIdAndUpdate(categoriesData._id, {
                type: "Categories",
                categories: categoriesItems,
            }, { new: true });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get layout by type
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layout = await layout_model_1.default.findOne({ type });
        if (!layout) {
            return next(new ErrorHandler_1.default(`${type} layout not found`, 404));
        }
        res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
