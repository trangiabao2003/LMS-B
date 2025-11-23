import { useGetHeroDataQuery, useEditLayoutMutation } from '@/redux/features/layout/layoutApi';
import { styles } from '@/styles/styles';
import { useEffect, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

type Props = {}

const EditHero = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [editLayout, { isLoading: updateLoading }] = useEditLayoutMutation();
  const { data, isLoading, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.layout?.banner) {
      setTitle(data.layout.banner.title || "");
      setSubTitle(data.layout.banner.subTitle || "");
      setImage(data.layout.banner.image?.url || "");
    }
  }, [data])

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target?.result) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const handleEdit = async () => {
    // Kiểm tra xem có thay đổi gì không
    const hasChanges = 
      data?.layout?.banner?.title !== title ||
      data?.layout?.banner?.subTitle !== subTitle ||
      data?.layout?.banner?.image?.url !== image;

    if (!hasChanges) {
      toast.error("No changes to save");
      return;
    }

    try {
      await editLayout({
        type: "Banner",
        image,
        title,
        subTitle,
      }).unwrap();
      
      toast.success("Hero section updated successfully!");
      refetch();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update hero section");
    }
  }

  // Kiểm tra xem có thay đổi không
  const hasChanges = 
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subTitle !== subTitle ||
    data?.layout?.banner?.image?.url !== image;

  return (
    <>
      {isLoading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full 1000px:flex items-center">
          {/* Image Section */}
          <div className="w-full 1000px:w-[40%] flex items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
            {image ? (
              <div className="relative flex items-center justify-center">
                <img
                  src={image}
                  alt="banner"
                  className="object-contain max-w-[90%] w-[90%] 1500px:max-w-[85%] 1500px:w-[85%] 1100px:max-w-[90%] h-auto z-10"
                />
                <input
                  type="file"
                  name="banner"
                  id="banner"
                  accept="image/*"
                  onChange={handleUpdate}
                  className="hidden"
                />
                <label 
                  htmlFor="banner" 
                  className="absolute bottom-0 right-0 z-20 cursor-pointer"
                >
                  <div className="w-[30px] h-[30px] bg-slate-900 rounded-full flex items-center justify-center cursor-pointer">
                    <AiOutlineCamera className="dark:text-white text-black text-[18px]" />
                  </div>
                </label>
              </div>
            ) : (
              <div className="w-full">
                <label htmlFor="banner">
                  <div className="w-full min-h-[300px] dark:border-white border-[#00000026] border-dashed border-2 p-3 flex items-center justify-center cursor-pointer rounded-md">
                    <div className="flex flex-col items-center">
                      <AiOutlineCamera className="text-6xl dark:text-white text-black mb-4" />
                      <p className="dark:text-white text-black text-lg">
                        Drag and drop your thumbnail here
                      </p>
                      <p className="dark:text-[#ffffff99] text-[#00000099] text-sm mt-2">
                        or click to browse (PNG, JPG, WebP)
                      </p>
                    </div>
                  </div>
                </label>
                <input
                  type="file"
                  name="banner"
                  id="banner"
                  accept="image/*"
                  onChange={handleUpdate}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Text Content Section */}
          <div className="w-full 1000px:w-[60%] flex flex-col items-center 1000px:items-start 1000px:mt-[0px] text-center 1000px:text-left mt-[50px]">
            <textarea
              className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[50px] 1500px:text-[60px] font-semibold font-Josefin py-2 1000px:leading-[60px] 1500px:leading-[70px] bg-transparent outline-none border-none"
              placeholder="Improve Your Online Learning Experience Better Instantly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={3}
            />
            <textarea
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="We have 20k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
              className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-semibold text-[16px] 1000px:text-[18px] w-full bg-transparent resize-none outline-none border-none mt-4"
              rows={3}
            />
            <div className="mt-8 1000px:mt-10">
              <button
                className={`
                  ${styles.button}
                  w-[100px] 
                  min-h-10 
                  h-10 
                  rounded
                  dark:text-white 
                  text-black 
                  ${hasChanges && !updateLoading
                    ? "cursor-pointer bg-[#42d383] hover:bg-[#3aba75]"
                    : "cursor-not-allowed bg-[#cccccc34]"
                  }
                  ${updateLoading ? "opacity-50" : ""}
                `}
                onClick={hasChanges && !updateLoading ? handleEdit : undefined}
                disabled={!hasChanges || updateLoading}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditHero