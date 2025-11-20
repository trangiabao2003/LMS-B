import React, { FC } from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import { styles } from '@/styles/styles';

type Props = {
    active: number;
    setActive: (active: number) => void;
}

const CourseOptions = ({ active, setActive }: Props) => {
    const options = [
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview",
    ];

    return (
        <div className={styles.stepperContainer}>
            <h3 className={`${styles.label} text-[18px]`}>Course Creation Steps</h3>
            <div className="relative">
                {options.map((option: any, index: number) => (
                    <div key={index} className={`${styles.stepperItem} py-2`}
                        onClick={() => setActive(index)}>
                        <div
                            className={`${styles.stepperNumber} ${active + 1 > index ? "bg-green-500 shadow-lg shadow-green-500/50" : active === index ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-gray-400"}`}
                        >
                            {active + 1 > index ? (
                                <IoMdCheckmark className="text-[20px]" />
                            ) : (
                                <span className="text-[14px]">{index + 1}</span>
                            )}
                        </div>
                        <h5
                            className={`${styles.stepperLabel} ${active === index
                                ? "text-blue-500 font-semibold"
                                : active + 1 > index
                                    ? "text-green-500"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {option}
                        </h5>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CourseOptions;