import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { ArrowRight, Star, Search } from "lucide-react"
import Image from "next/image"
import Loader from "./Loader/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter()

  const handleSearch = () => {
    if (search === "") {
      return
    } else {
      router.push(`/courses?title=${search}`);
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-background pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-primary">Trusted by 500K+ learners</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                  {data?.layout?.banner?.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                  {data?.layout?.banner?.subTitle}
                </p>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for courses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSearch}
                    className="gap-2 h-12 px-8"
                  >
                    Search
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="gap-2">
                    Explore Courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">500K+</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">4.8★</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative h-96 md:h-full min-h-96">
                {data ? (
                  <Image
                    src={data?.layout?.banner?.image?.url}
                    alt="banner"
                    width={600}
                    height={400}
                    className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-10"
                  />
                ) : (
                  <div className="">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
                    <div className="relative h-full rounded-2xl border border-border bg-card p-8 flex flex-col justify-center items-center gap-6">
                      <div className="w-full space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
                          >
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <div className="h-6 w-6 rounded bg-primary/40" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-24 rounded bg-muted" />
                              <div className="h-2 w-32 rounded bg-muted/50" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
                }
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
