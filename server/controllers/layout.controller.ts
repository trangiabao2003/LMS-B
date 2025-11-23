import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

//create layout
export const createLayout = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.body;
			const isTypeExist = await LayoutModel.findOne({ type });
			if (isTypeExist) {
				return next(new ErrorHandler(`${type} already exist`, 400));
			}
			if (type === "Banner") {
				const { image, title, subTitle } = req.body;
				const myCloud = await cloudinary.v2.uploader.upload(image, {
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

				await LayoutModel.create(banner);
			}
			if (type === "FAQ") {
				const { faq } = req.body;
				const faqItems = await Promise.all(
					faq.map(async (item: any) => {
						return {
							question: item.question,
							answer: item.answer,
						};
					})
				);
				await LayoutModel.create({ type: "FAQ", faq: faqItems });
			}
			if (type === "Categories") {
				const { categories } = req.body;
				const categoriesItems = await Promise.all(
					categories.map(async (item: any) => {
						return {
							title: item.title,
						};
					})
				);
				await LayoutModel.create({
					type: "Categories",
					categories: categoriesItems,
				});
			}
			res.status(200).json({
				success: true,
				message: "Layout created successfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//edit layout
export const editLayout = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.body;
			
			if (type === "Banner") {
				let bannerData: any = await LayoutModel.findOne({ type: "Banner" });
				
				const { image, title, subTitle } = req.body;

				// Nếu chưa có Banner, tạo mới
				if (!bannerData) {
					const banner: any = {
						type: "Banner",
						banner: {
							title,
							subTitle,
						},
					};

					// Upload ảnh nếu có
					if (image && image.startsWith('data:image')) {
						const myCloud = await cloudinary.v2.uploader.upload(image, {
							folder: "layout",
						});
						banner.banner.image = {
							public_id: myCloud.public_id,
							url: myCloud.secure_url,
						};
					}

					await LayoutModel.create(banner);
				} else {
					// Update Banner đã tồn tại
					// Chỉ xóa ảnh cũ nếu có ảnh mới và ảnh mới khác ảnh cũ
					if (image && bannerData.banner?.image?.public_id && 
						image !== bannerData.banner.image.url) {
						try {
							await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
						} catch (error) {
							console.log("Error deleting old image:", error);
						}
					}

					const banner: any = {
						title,
						subTitle,
					};

					// Chỉ upload ảnh mới nếu image là base64 (ảnh mới)
					if (image && image.startsWith('data:image')) {
						const myCloud = await cloudinary.v2.uploader.upload(image, {
							folder: "layout",
						});
						banner.image = {
							public_id: myCloud.public_id,
							url: myCloud.secure_url,
						};
					} else if (image) {
						// Giữ nguyên ảnh cũ
						banner.image = bannerData.banner.image;
					}

					await LayoutModel.findByIdAndUpdate(
						bannerData._id, 
						{ banner },
						{ new: true }
					);
				}
			}
			
			if (type === "FAQ") {
				const { faq } = req.body;
				const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
				
				if (!FaqItem) {
					return next(new ErrorHandler("FAQ layout not found", 404));
				}

				const faqItems = await Promise.all(
					faq.map(async (item: any) => {
						return {
							question: item.question,
							answer: item.answer,
						};
					})
				);
				
				await LayoutModel.findByIdAndUpdate(
					FaqItem._id, 
					{
						type: "FAQ",
						faq: faqItems,
					},
					{ new: true }
				);
			}
			
			if (type === "Categories") {
				const { categories } = req.body;
				const categoriesData = await LayoutModel.findOne({
					type: "Categories",
				});
				
				if (!categoriesData) {
					return next(new ErrorHandler("Categories layout not found", 404));
				}

				const categoriesItems = await Promise.all(
					categories.map(async (item: any) => {
						return {
							title: item.title,
						};
					})
				);
				
				await LayoutModel.findByIdAndUpdate(
					categoriesData._id, 
					{
						type: "Categories",
						categories: categoriesItems,
					},
					{ new: true }
				);
			}
			
			res.status(200).json({
				success: true,
				message: "Layout updated successfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//get layout by type
export const getLayoutByType = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { type } = req.params;
			const layout = await LayoutModel.findOne({ type });
			
			if (!layout) {
				return next(new ErrorHandler(`${type} layout not found`, 404));
			}
			
			res.status(200).json({
				success: true,
				layout,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);