"use client";
import { useEffect, useState } from "react";
import { getDatabase, ref, get, remove, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/js/firebaseConfig";
import Swal from "sweetalert2";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const SubCategoriesTable: React.FC = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            const isLoggedInLocalStorage = localStorage.getItem('isLoggedIn');
            if (!user || isLoggedInLocalStorage !== 'true') {
                window.location.href = '../';
            }
        });
        const fetchCategories = async () => {
            try {
                const snapshot = await get(ref(database, "categories"));
                const categoriesData = snapshot.val() || {};
                setCategories(categoriesData);
                setLoading(false);
                console.log(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (categoryId: string) => {
        try {
            await remove(ref(database, `categories/${categoryId}`));
            Swal.fire("Category deleted successfully", "success");
             // @ts-ignore
            setCategories((prev) => prev.filter((_, id) => _.id !== categoryId));
        } catch (error) {
            Swal.fire("Failed to delete category", "error");
            console.error("Error deleting category:", error);
        }
    };

    const deleteSubCategory = async (categoryId: string, subCategoryId: number) => {
        try {
            const categoryRef = ref(database, `categories/${categoryId}`);
            const categorySnapshot = await get(categoryRef);
            const categoryData = categorySnapshot.val();

            if (categoryData && categoryData.subCategories) {
                const updatedSubCategories = categoryData.subCategories.filter((_: string, index: number) => index !== subCategoryId);
                await set(categoryRef, { ...categoryData, subCategories: updatedSubCategories });
                Swal.fire("Success!", "Sub category deleted successfully", "success");
                setCategories((prev) => ({
                    ...prev,
                    [categoryId]: { ...categoryData, subCategories: updatedSubCategories },
                }));
            }
        } catch (error) {
            Swal.fire("Error!", "Failed to delete sub category", "error");
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between px-4 py-6 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">Top Categories and Sub Categories</h4>
                <div>
                    <Link
                        href="/add-sub-category"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Sub Category
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Category Name</p>
                </div>
                <div className="col-span-3 hidden items-center sm:flex">
                    <p className="font-medium">Sub Categories Name</p>
                </div>
                <div className="col-span-1 flex items-center text-center">
                    <p className="font-medium">Category Action</p>
                </div>
            </div>
            <div id="categories-data">
                {Object.entries(categories).map(([categoryId, categoryData]) => (
                    <div key={categoryId} className="category-item">
                        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <div className="col-span-2 flex items-center">
                            {/*  @ts-ignore */}
                                <p className="text-sm text-black dark:text-white">  {typeof categoryData === 'string' ? categoryData : categoryData.name}</p>
                            </div>
                            <div className="col-span-3 flex items-center">
                            {/*  @ts-ignore */}
                                {categoryData.subCategories && categoryData.subCategories.length > 0 ? (
                                    <ul>
                                         {/*  @ts-ignore */}
                                        {categoryData.subCategories.map((subCategory: string, index: number) => (
                                            <li key={index} className="w-full flex justify-between">
                                                <p className="text-sm text-black dark:text-white">{subCategory}</p>
                                                <div className="flex gap-2 items-center">
                                                <button
                                                    onClick={() => deleteSubCategory(categoryId, index)}
                                                    className="text-red-500 ml-4 hover:text-red-700"
                                                >
                                                    <svg
                                                        className="fill-current "
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 18 18"
                                                        fill="red"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill="red"
                                                        />
                                                        <path
                                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                            fill="red"
                                                        />
                                                        <path
                                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                            fill="red"
                                                        />
                                                        <path
                                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </button>
                                                {/* <Link href={`/update-sub-category/${subCategory}`} className="hover:text-primary">
                                                    <svg className="feather feather-edit" fill="none" height="14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" width="14"
                                                        xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </Link> */}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-sm text-black dark:text-white">No subcategories</span>
                                )}
                            </div>
                            <div className="col-span-1 flex items-center">
                                <button onClick={() => deleteCategory(categoryId)} className="text-red-500 hover:text-red-700">
                                    <svg
                                        className="fill-current "
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="red"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                            fill="red"
                                        />
                                        <path
                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                            fill="red"
                                        />
                                        <path
                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                            fill="red"
                                        />
                                        <path
                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubCategoriesTable;
