"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "@/components/Loader/Loader";
import { Header } from "@/components/header";
import { Heading } from "../utils/Heading";
import { CourseCard } from "@/components/course/course-card";
import { styles } from "@/styles/styles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";

const CoursesContent = () => {
    const searchParams = useSearchParams();
    const urlSearch = searchParams?.get('title');
    const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
    const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(urlSearch || "");
    const [category, setCategory] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState<string>("All");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>("rating");
    const [showFilters, setShowFilters] = useState(false);

    // Update search query when URL param changes
    useEffect(() => {
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [urlSearch]);

    const categories = categoriesData?.layout.categories;

    // Extract unique levels and tags from courses
    const { levels, allTags } = useMemo(() => {
        if (!data?.courses) return { levels: [], allTags: [] };

        const levelsSet = new Set<string>();
        const tagsSet = new Set<string>();

        data.courses.forEach((course: any) => {
            if (course.level) levelsSet.add(course.level);
            if (course.tags) {
                const courseTags = typeof course.tags === 'string'
                    ? course.tags.split(',').map((t: string) => t.trim())
                    : course.tags;
                courseTags.forEach((tag: string) => tagsSet.add(tag));
            }
        });

        return {
            levels: Array.from(levelsSet),
            allTags: Array.from(tagsSet)
        };
    }, [data?.courses]);

    // Filter and sort courses
    const filteredCourses = useMemo(() => {
        if (!data?.courses) return [];

        let filtered = [...data.courses];

        if (category !== "All") {
            filtered = filtered.filter((course: any) => course.categories === category);
        }

        if (searchQuery) {
            filtered = filtered.filter((course: any) =>
                course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.tags?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedLevel !== "All") {
            filtered = filtered.filter((course: any) => course.level === selectedLevel);
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter((course: any) => {
                const courseTags = typeof course.tags === 'string'
                    ? course.tags.toLowerCase().split(',').map((t: string) => t.trim())
                    : (course.tags || []).map((t: string) => t.toLowerCase());
                return selectedTags.some(tag =>
                    courseTags.includes(tag.toLowerCase())
                );
            });
        }

        if (priceRange !== "All") {
            filtered = filtered.filter((course: any) => {
                const price = course.price || 0;
                switch (priceRange) {
                    case "free":
                        return price === 0;
                    case "0-50":
                        return price > 0 && price <= 50;
                    case "50-100":
                        return price > 50 && price <= 100;
                    case "100+":
                        return price > 100;
                    default:
                        return true;
                }
            });
        }

        filtered.sort((a: any, b: any) => {
            switch (sortBy) {
                case "latest":
                    return new Date(b.updatedAt || b.createdAt).getTime() -
                        new Date(a.updatedAt || a.createdAt).getTime();
                case "oldest":
                    return new Date(a.updatedAt || a.createdAt).getTime() -
                        new Date(b.updatedAt || b.createdAt).getTime();
                case "price-low":
                    return (a.price || 0) - (b.price || 0);
                case "price-high":
                    return (b.price || 0) - (a.price || 0);
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "popular":
                    return (b.purchased || 0) - (a.purchased || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [data?.courses, category, searchQuery, selectedLevel, selectedTags, priceRange, sortBy]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setCategory("All");
        setSelectedLevel("All");
        setSelectedTags([]);
        setPriceRange("All");
        setSortBy("latest");
    };

    const hasActiveFilters = searchQuery || category !== "All" || selectedLevel !== "All" ||
        selectedTags.length > 0 || priceRange !== "All" || sortBy !== "latest";

    return (
        <div className="flex flex-col min-h-screen">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header
                        route={route}
                        setRoute={setRoute}
                        open={open}
                        setOpen={setOpen}
                        activeItem={1}
                    />
                    <div className="w-[95%] md:w-[90%] lg:w-[85%] m-auto min-h-[70vh] py-8">
                        <Heading
                            title={"All courses - Elearning"}
                            description={"Elearning is a programming community."}
                            keywords={
                                "programming community, coding skills, expert insights, collaboration, growth"
                            }
                        />

                        {/* Search Bar */}
                        <div className="mb-6 mt-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search courses by name, description, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-[80%] md:w-[60%] lg:w-[40%] m-auto pl-10 h-12 text-base"
                                />
                            </div>
                        </div>

                        {/* Filter Toggle Button (Mobile) */}
                        <div className="mb-4 md:hidden">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </Button>
                        </div>

                        {/* Filters Section */}
                        <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {/* Level Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Level</label>
                                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Levels</SelectItem>
                                            {levels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                                    <Select value={priceRange} onValueChange={setPriceRange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select price range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Prices</SelectItem>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="0-50">$0 - $50</SelectItem>
                                            <SelectItem value="50-100">$50 - $100</SelectItem>
                                            <SelectItem value="100+">$100+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Latest Updated</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            onClick={clearAllFilters}
                                            className="w-full gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Tags Filter */}
                            {allTags.length > 0 && (
                                <div className="mb-4">
                                    <label className="text-sm font-medium mb-2 block">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.slice(0, 10).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => handleTagToggle(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="w-full flex items-center flex-wrap gap-2 mb-6">
                            <div
                                className={`h-[35px] ${category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"} px-4 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer transition-all hover:opacity-80`}
                                onClick={() => setCategory("All")}>
                                All
                            </div>
                            {
                                categories && categories.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`h-[35px] ${category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"} px-4 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer transition-all hover:opacity-80`}
                                        onClick={() => setCategory(item.title)}>
                                        {item.title}
                                    </div>
                                ))
                            }
                        </div>

                        {/* Results Count */}
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredCourses.length} of {data?.courses?.length || 0} courses
                            </p>
                        </div>

                        {/* No Results Message */}
                        {filteredCourses.length === 0 && (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                                <p className={`${styles.label} mb-4`}>
                                    {searchQuery ? "No courses found matching your search!" : "No courses found in this category. Please try another one!"}
                                </p>
                                {hasActiveFilters && (
                                    <Button onClick={clearAllFilters} variant="outline">
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Course Grid */}
                        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
                            {filteredCourses.map((item: any, index: number) => (
                                <CourseCard key={item._id || index} course={item} isProfile={false} />
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <CoursesContent />
        </Suspense>
    );
};

export default Page;