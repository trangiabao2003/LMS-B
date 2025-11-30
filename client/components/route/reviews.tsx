import { styles } from '@/styles/styles';
import Image from 'next/image';
import ReviewCard from '../reviews/review-card';

type Props = {}

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Cambridge university",
    comment: "LMSB does a good job of explaining the concepts in a clear and concise way, and the examples are well-chosen. Overall, this is a valuable resource for anyone",
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Quarter ltd.",
    comment: "LMSB does a good job of explaining the concepts in a clear and concise way, and the examples are well-chosen. Overall, this is a valuable resource for anyone",
  },
  {
    name: "Jay Gibbs",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "computer systems engineering student | Zimbabwe",
    comment: "LMSB does a good job of explaining the concepts in a clear and concise way, and the examples are well-chosen. Overall, this is a valuable resource for anyone",
  },
  {
    name: "Mina Davidson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Junior Web Developer | Indonesia",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
  }
]

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] md:w-[85%] m-auto">
      <div className="flex flex-row w-full md:flex items-center">
        <div className="md:w-[50%] w-full">
          <Image
            src={require("./../../public/business-img.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="md:w-[50%] w-full">
          <h3 className={`${styles.title} md:text-[40px]! `}>
            Our Students Are <span className="text-gradient">Our Strength</span>{" "}
            <br /> See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque unde voluptatum dignissimos, nulla perferendis dolorem voluptate nemo possimus magni deleniti natus accusamus officiis quasi nihil commodi, praesentium quidem, quis doloribus?
          </p>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md: [&>*:nth-child(odd)]:pr-2 [&>*:nth-child(even)]:pl-2">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
}

export default Reviews