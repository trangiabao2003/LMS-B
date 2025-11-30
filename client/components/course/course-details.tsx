import Ratings from '@/app/utils/Ratings';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import CoursePlayer from '@/app/utils/CoursePlayer';
import { styles } from '@/styles/styles';
import Link from 'next/link';
import { Check, Users, Star, Clock, BookOpen, Award, Shield } from 'lucide-react';
import CourseContentList from './course-content-list';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Props = {
  data: any;
}

const CourseDetails = ({ data }: Props) => {
  const { user } = useSelector((state: any) => state.auth);

  const discountPercentage = data?.estimatedPrice
    ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
    : 0;

  const isPurchased = user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = (e: any) => {
    console.log("Order course:", data._id);
  };

  // Calculate total duration from courseData
  const totalDuration = data?.courseData?.reduce((acc: number, item: any) => {
    return acc + (item.videoLength || 0)
  }, 0) || 0

  const durationInHours = (totalDuration / 60).toFixed(1);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {data?.level}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {data?.categories || "Uncategorized"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {data?.name}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {data?.description?.substring(0, 200)}...
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{data?.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground">({data?.reviews?.length || 0} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{data?.purchased || 0} students</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{durationInHours}h total</span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{data?.courseData?.length || 0} lectures</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* What You'll Learn */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  What you'll learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data?.benefits?.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <IoCheckmarkDoneOutline className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-foreground">{item.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
                <div className="space-y-3">
                  {data?.prerequisites?.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <IoCheckmarkDoneOutline className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-foreground">{item.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <CourseContentList />
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Course Description</h2>
                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {data?.description}
                </p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {data?.reviews?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Ratings rating={data?.rating || 0} />
                      <span className="text-lg font-semibold">
                        {data?.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({data?.reviews?.length} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[...data.reviews].reverse().map((item: any, index: number) => (
                      <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-lg font-semibold text-primary uppercase">
                                {item.user?.name?.slice(0, 2) || "AN"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{item.user?.name || "Anonymous"}</h4>
                              <span className="text-sm text-muted-foreground">
                                {item.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy") : "N/A"}
                              </span>
                            </div>
                            <Ratings rating={item.rating || 0} />
                            <p className="text-foreground">{item.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Video Preview Card */}
              <Card className="overflow-hidden">
                <div className="w-full">
                  <CoursePlayer videoUrl={data?.demoUrl} title={data?.name} />
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-foreground">
                        {data?.price === 0 ? "Free" : `$${data?.price}`}
                      </span>
                      {data?.estimatedPrice > data?.price && (
                        <>
                          <span className="text-xl text-muted-foreground line-through">
                            ${data?.estimatedPrice}
                          </span>
                          <Badge variant="destructive" className="text-sm">
                            {discountPercentage.toFixed(0)}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {isPurchased ? (
                    <Link
                      href={`/course-access/${data?._id}`}
                      className="block w-full"
                    >
                      <button className={`${styles.button} w-full py-4 text-lg font-semibold`}>
                        Enter Course
                      </button>
                    </Link>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={handleOrder}
                        className={`${styles.button} w-[80%] py-4 text-lg font-semibold bg-cyan-600 hover:bg-cyan-400/50`}
                      >
                        Buy Now - ${data?.price}
                      </button>
                    </div>
                  )}

                  <Separator />

                  {/* Course Features */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">This course includes:</h3>

                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Source code included</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Full lifetime access</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Certificate of completion</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Premium support</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-sm">30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Course Details</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{data?.level}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{durationInHours} hours</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lectures:</span>
                      <span className="font-medium">{data?.courseData?.length || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enrolled:</span>
                      <span className="font-medium">{data?.purchased || 0} students</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">English</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;