import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList = (props: Props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  // Unique sections
  const videoSections: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount = 0;

  const toggleSection = (section: string) => {
    const newVisible = new Set(visibleSections);
    newVisible.has(section)
      ? newVisible.delete(section)
      : newVisible.add(section);
    setVisibleSections(newVisible);
  };

  return (
    <div
      className={`mt-[15px] w-full ${
        !props.isDemo && "ml-[-30px] sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section: string) => {
        const isSectionVisible = visibleSections.has(section);
        const sectionVideos = props.data.filter(
          (item: any) => item.videoSection === section
        );

        const sectionVideoCount = sectionVideos.length;
        const sectionVideoLength = sectionVideos.reduce(
          (sum: number, item: any) => sum + item.videoLength,
          0
        );

        const sectionStartIndex = totalCount;
        totalCount += sectionVideoCount;

        const sectionContentHours = sectionVideoLength / 60;

        return (
          <div
            key={section}
            className={`${!props.isDemo && "border-b border-[#ffffff8e] pb-2"}`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between cursor-pointer">
              <button
                className="mr-4 cursor-pointer text-black dark:text-white flex items-center gap-2"
                onClick={() => toggleSection(section)}
              >
                {isSectionVisible ? (
                  <BsChevronUp size={20} />
                ) : (
                  <BsChevronDown size={20} />
                )}
                <span className="text-lg font-semibold">{section}</span>
              </button>
            </div>

            {/* Section Info */}
            <h5 className="text-black dark:text-white mt-2">
              {sectionVideoCount} Lessons –{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "hours" : "minutes"}
            </h5>

            <br />

            {/* Section Content */}
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex = sectionStartIndex + index;
                  const contentLength = item.videoLength / 60;

                  return (
                    <div
                      key={item._id}
                      onClick={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                      className={`w-full ${
                        videoIndex === props.activeVideo
                          ? "bg-slate-800"
                          : ""
                      } cursor-pointer transition-all p-2`}
                    >
                      <div className="flex items-start gap-2">
                        <MdOutlineOndemandVideo
                          size={25}
                          color="#1cdada"
                          className="mt-1"
                        />

                        <h1 className="text-[18px] wrap-break-word text-black dark:text-white">
                          {item.title}
                        </h1>
                      </div>

                      <h5 className="pl-8 text-black dark:text-white">
                        {item.videoLength > 60
                          ? contentLength.toFixed(2)
                          : item.videoLength}{" "}
                        {item.videoLength > 60 ? "hours" : "minutes"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
