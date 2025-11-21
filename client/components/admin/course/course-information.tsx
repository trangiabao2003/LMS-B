"use client"

import { styles } from '@/styles/styles';
import { useState } from 'react'
import { IoCloudUploadOutline } from 'react-icons/io5';

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation = ({ courseInfo, setCourseInfo, active, setActive }: Props) => {
    const [dragging, setDragging] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    }

    const handleChangeFile = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className={styles.courseForm}>
                {/* Course Basic Info Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Basic Information</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={courseInfo.name}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
                            id="name"
                            placeholder="Enter your course name (e.g., MERN Stack LMS Platform)"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>
                            Course Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            cols={30}
                            rows={5}
                            value={courseInfo.description}
                            placeholder="Write an engaging course description that attracts students..."
                            className={styles.textarea}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Pricing Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Pricing</h3>
                    
                    <div className={styles.twoColumnGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="price" className={styles.label}>
                                Course Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">$</span>
                                <input
                                    id="price"
                                    type="number"
                                    required
                                    placeholder="99"
                                    value={courseInfo.price}
                                    className={`${styles.input} pl-8`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="estimatedPrice" className={styles.label}>
                                Estimated Price (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">$</span>
                                <input
                                    id="estimatedPrice"
                                    type="number"
                                    placeholder="149"
                                    value={courseInfo.estimatedPrice}
                                    className={`${styles.input} pl-8`}
                                    onChange={(e: any) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Details Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Course Details</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="tags" className={styles.label}>
                            Course Tags <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="tags"
                            type="text"
                            name="tags"
                            placeholder='e.g., Next.js, TypeScript, Tailwind CSS, MongoDB'
                            required
                            value={courseInfo.tags}
                            className={styles.input}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Separate tags with commas</p>
                    </div>

                    <div className={styles.twoColumnGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="level" className={styles.label}>
                                Course Level <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="level"
                                type="text"
                                name="level"
                                placeholder='e.g., Beginner, Intermediate, Advanced'
                                required
                                value={courseInfo.level}
                                className={styles.input}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="demoUrl" className={styles.label}>
                                Demo URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="demoUrl"
                                type="url"
                                name="demoUrl"
                                placeholder='https://youtube.com/embed/...'
                                required
                                value={courseInfo.demoUrl}
                                className={styles.input}
                                onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Thumbnail Upload Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Course Thumbnail</h3>
                    
                    <div className='w-full'>
                        <input type="file"
                            accept='image/*'
                            id='file'
                            className='hidden'
                            onChange={handleChangeFile} />
                        <label htmlFor="file"
                            className={`${styles.uploadArea} ${dragging ? styles.uploadAreaActive : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {
                                courseInfo.thumbnail ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <img src={courseInfo.thumbnail} alt="Thumbnail preview" className="max-h-[200px] w-auto object-cover rounded-lg" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Click to change thumbnail</p>
                                    </div>
                                ) : (
                                    <div className={styles.uploadText}>
                                        <IoCloudUploadOutline className="text-5xl mx-auto mb-3 text-blue-500" />
                                        <p className="font-semibold">Drag and drop your thumbnail here</p>
                                        <p className="text-sm mt-2">or click to browse (PNG, JPG, WebP)</p>
                                    </div>
                                )}
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Continue to Next Step →
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CourseInformation