"use client"

import Loader from '@/components/Loader/Loader';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { styles } from '@/styles/styles';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';

type Props = {}

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (data && data.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }
  }, [layoutSuccess]);

  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message || "Failed to update categories");
      }
    }
  }, [error]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  }

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [
        ...prevCategory,
        { _id: Date.now(), title: "" },
      ]);
    }
  }

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((q) => q.title.trim() === "");
  };

  const handleEditCategories = async () => {
    if (
      data?.layout?.categories &&
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories && categories.length > 0 ? (
            categories.map((item: any, index: number) => {
              return (
                <div key={item._id} className="p-3">
                  <div className="flex items-center w-full justify-center gap-2">
                    <input
                      className={`${styles.input} w-[unset]! border-none! text-[20px]!`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer hover:opacity-70 transition-opacity"
              onClick={newCategoriesHandler}
            />
          </div>
          <div className="flex justify-center mt-12 mb-12">
            <button
              className={`${styles.button} w-[100px]! min-h-10! h-10! dark:text-white text-black bg-[#cccccc34] rounded flex items-center justify-center
                ${areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
                  isAnyCategoryTitleEmpty(categories)
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer bg-[#42d383]"
                }`}
              onClick={handleEditCategories}
              disabled={
                areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
                isAnyCategoryTitleEmpty(categories)
              }
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}


export default EditCategories