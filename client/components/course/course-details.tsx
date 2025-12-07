import Ratings from '@/app/utils/Ratings';
import { IoCheckmarkDoneOutline, IoCloseOutline } from 'react-icons/io5';
import CoursePlayer from '@/app/utils/CoursePlayer';
import { styles } from '@/styles/styles';
import Link from 'next/link';
import { Check, Users, Star, Clock, BookOpen, Award, Shield } from 'lucide-react';
import CourseContentList from './course-content-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import CheckoutForm from '../payment/checkout-form';
import { Elements } from '@stripe/react-stripe-js';
import { useCheckCoursePurchasedQuery } from '@/redux/features/orders/ordersApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

type Props = {
  data: any;
  clientSecret?: string;
  stripePromise?: any;
}

const CourseDetails = ({ data, clientSecret, stripePromise }: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user;
  const [open, setOpen] = useState(false);

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo('en-US');

  // Check if course is purchased via orders collection
  const {
    data: purchaseData,
    isLoading: checkingPurchase,
    refetch: refetchPurchased
  } = useCheckCoursePurchasedQuery(data?._id, {
    skip: !user || !data?._id, // Skip if no user or course ID
  });

  const isPurchased = purchaseData?.isPurchased || false;

  const discountPercentage = data?.estimatedPrice
    ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
    : 0;

  // Calculate total duration from courseData
  const totalDuration = data?.courseData?.reduce((acc: number, item: any) => {
    return acc + (item.videoLength || 0)
  }, 0) || 0

  const durationInHours = (totalDuration / 60).toFixed(1);

  const handleOrder = (e: any) => {
    if (!user) {
      return;
    }
    setOpen(true);
  };

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
                <CourseContentList data={data?.courseData}
                  isDemo={true} />
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
                        {/* Main Review */}
                        <div className="flex gap-3">
                          <div className="shrink-0">
                            <Image
                              src={
                                item.user.avatar
                                  ? item.user.avatar.url
                                  : "/avatar.jpg"
                              }
                              height={36}
                              width={36}
                              alt="avatar"
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[18px] font-semibold">{item.user?.name || "Anonymous"}</h4>
                            <Ratings rating={item.rating || 0} />
                            <p className="text-foreground mt-1">{item.comment}</p>
                            <small className="text-slate-700 dark:text-[#ffffff83]">
                              {item.createdAt && timeAgo ? timeAgo.format(new Date(item.createdAt)) : "N/A"}
                            </small>
                          </div>
                        </div>

                        {/* Admin Replies - Indented to the right */}
                        {item.commentReplies.map((i: any, replyIndex: number) => (
                          <div key={replyIndex} className="w-full flex md:ml-16 my-5">
                            <div className="w-10 h-10 shrink-0">
                              <Image
                                src={
                                  i.user.avatar
                                    ? i.user.avatar.url
                                    : "/avatar.jpg"
                                }
                                width={40}
                                height={40}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="pl-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-[16px] font-semibold">{i.user.name}</h5>
                                <MdVerified className="text-[#0095F6] text-[20px]" />
                              </div>
                              <p className="mt-1">{i.comment}</p>
                              <small className="text-[#ffffff83]">
                                {timeAgo?.format(new Date(i.createdAt)) || 'Just now'}
                              </small>
                            </div>
                          </div>
                        ))}
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
                  {checkingPurchase ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                    </div>
                  ) : isPurchased ? (
                    <Link
                      href={`/course-access/${data?._id}`}
                      className="block w-full"
                    >
                      <button className={`${styles.button} w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700`}>
                        Enter to Course
                      </button>
                    </Link>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={handleOrder}
                        disabled={!clientSecret || !user}
                        className={`${styles.button} w-[80%] py-4 text-lg font-semibold ${!clientSecret || !user
                          ? 'bg-gray-400 cursor-not-allowed opacity-60'
                          : 'bg-cyan-600 hover:bg-cyan-400/50'
                          }`}
                      >
                        {!user
                          ? 'Login to Buy'
                          : !clientSecret
                            ? 'Loading...'
                            : `Buy Now - $${data?.price}`
                        }
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
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {
                  stripePromise && clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret: clientSecret }}
                    >
                      <CheckoutForm
                        setOpen={setOpen}
                        data={data}
                        refetchPurchased={refetchPurchased}
                        user={user}
                      />
                    </Elements>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
                      <p className="text-gray-600 font-medium">Preparing payment...</p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )}
      </>
    </div >
  );
};

export default CourseDetails;