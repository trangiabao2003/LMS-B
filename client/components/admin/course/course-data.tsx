import { styles } from '@/styles/styles';
import toast from 'react-hot-toast';
import { IoAddCircle } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseData = ({
    benefits,
    setBenefits,
    prerequisites,
    setPrerequisites,
    active,
    setActive,
}: Props) => {

    const handleBenefitChange = (index: number, value: any) => {
        const updatedBenefits = benefits.map((benefit, i) => {
            if (i === index) {
                return { title: value };
            }
            return benefit;
        });
        setBenefits(updatedBenefits);
    }

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: "" }])
    }

    const handleRemoveBenefit = (index: number) => {
        if (benefits.length > 1) {
            const updatedBenefits = benefits.filter((_, i) => i !== index);
            setBenefits(updatedBenefits);
        } else {
            toast.error("You must have at least one benefit");
        }
    }

    const handlePrerequisitesChange = (index: number, value: any) => {
        const updatedPrerequisites = prerequisites.map((prerequisite, i) => {
            if (i === index) {
                return { title: value };
            }
            return prerequisite;
        });
        setPrerequisites(updatedPrerequisites);
    }

    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: "" }])
    }

    const handleRemovePrerequisite = (index: number) => {
        if (prerequisites.length > 1) {
            const updatedPrerequisites = prerequisites.filter((_, i) => i !== index);
            setPrerequisites(updatedPrerequisites);
        } else {
            toast.error("You must have at least one prerequisite");
        }
    }

    const prevButton = () => {
        setActive(active - 1);
    }

    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
            setActive(active + 1);
        } else {
            toast.error("Please fill the fields for go to next!")
        }
    };

    return (
        <div className="w-[80%] m-auto mt-24 block">
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the benefits for students in this course?
                </label>
                <br />
                {
                    benefits.map((benefit: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 my-2">
                            <input
                                type="text"
                                name="Benefit"
                                placeholder="You will be able to build a full stack LMS Platform..."
                                required
                                className={`${styles.input} flex-1`}
                                value={benefit.title}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                            />
                            <AiOutlineDelete
                                className="text-red-500 cursor-pointer text-[20px] hover:text-red-700 transition"
                                onClick={() => handleRemoveBenefit(index)}
                                title="Remove benefit"
                            />
                        </div>
                    ))
                }
                <IoAddCircle
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddBenefit}
                />
            </div>

            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the prerequisites for starting this course?
                </label>
                <br />
                {
                    prerequisites.map((prerequisite: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 my-2">
                            <input
                                type="text"
                                name="prerequisites"
                                placeholder="You need basic knowledge of MERN Stack..."
                                required
                                className={`${styles.input} flex-1`}
                                value={prerequisite.title}
                                onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                            />
                            <AiOutlineDelete
                                className="text-red-500 cursor-pointer text-[20px] hover:text-red-700 transition"
                                onClick={() => handleRemovePrerequisite(index)}
                                title="Remove prerequisite"
                            />
                        </div>
                    ))
                }
                <IoAddCircle
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddPrerequisites}
                />
            </div>
            <div className="w-full flex items-center justify-between">
                <div
                    className="w-[15%] md:w-[180px] flex items-center justify-center h-10 bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer"
                    onClick={() => prevButton()}
                >
                    Prev
                </div>
                <div className="w-[15%] md:w-[180px] flex items-center justify-center h-10 bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer"
                    onClick={() => handleOptions()}
                >
                    Next
                </div>
            </div>
        </div >
    )
}

export default CourseData;