type Props = {
    data: any;
    activeVideo?: number;
    setActiveVideo?: (index: number) => void;
    isDemo: boolean;
}

const CourseContentMedia = ({ data, activeVideo, setActiveVideo, isDemo }: Props) => {
    const handleVideoClick = (index: number) => {
        if (!isDemo && setActiveVideo) {
            setActiveVideo(index);
        }
    };

    return (
        <div className="space-y-2">
            {data?.map((item: any, index: number) => (
                <div
                    key={index}
                    onClick={() => handleVideoClick(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        activeVideo === index 
                            ? 'bg-primary/10 border-l-4 border-primary' 
                            : 'hover:bg-muted'
                    } ${isDemo ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        {!isDemo && activeVideo === index && (
                            <span className="text-primary text-sm">Playing</span>
                        )}
                    </div>
                    {item.videoLength && (
                        <span className="text-sm text-muted-foreground">
                            {item.videoLength} min
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseContentMedia;