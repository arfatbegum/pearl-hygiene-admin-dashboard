"use client";


//@ts-ignore
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import firebaseConfig from "@/js/firebaseConfig";
import imgbbAPIKey from "@/js/imgbbConfig";
import { Editor } from "@tinymce/tinymce-react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const AddBrand = () => {
    const [brandName, setBrandName] = useState("");
    const [brandDetails, setBrandDetails] = useState("");
    const [brandUrl, setBrandUrl] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            const isLoggedInLocalStorage = localStorage.getItem('isLoggedIn');
            if (!user || isLoggedInLocalStorage !== 'true') {
                router.push('/');
            }
        });
    }, []);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setImage(file);
        } else {
            Swal.fire("Error!", "Please select a PNG, JPG, or JPEG image...", "error");
        }
    };

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append("image", image);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.data.url;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let uploadedImageUrl = imageUrl;

        if (image) {
            uploadedImageUrl = await uploadImage();
            setImageUrl(uploadedImageUrl);
        }

        const newBrand = {
            name: brandName,
            details: brandDetails,
            url: brandUrl,
            image: uploadedImageUrl,
        };

        const brandsRef = ref(database, 'brands');
        const newBrandRef = push(brandsRef);
        set(newBrandRef, newBrand)
            .then(() => {
                Swal.fire("Success!", "Brand added successfully", "success");
                router.push('/brands');
            })
            .catch((error) => {
                Swal.fire("Error!", error.message, "error");
            });
    };
    useEffect(() => {
        console.log("imageUrl state changed:", imageUrl); // Log whenever imageUrl changes
    }, [imageUrl]);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Brand" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Add Brand
                    </h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Brand Name
                            </label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="Brand Name"
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Brand Website URL
                            </label>
                            <input
                                type="text"
                                value={brandUrl}
                                onChange={(e) => setBrandUrl(e.target.value)}
                                placeholder="Brand Website URL"
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Brand Description
                            </label>
                            <Editor
                                apiKey="t8kmg7e4rwudb6di86xfy9jiwwuf7sncd7gl7gms1ct6cj1k"
                                value={brandDetails}
                                onEditorChange={(content) => setBrandDetails(content)}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help'
                                }}
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Images
                            </label>
                            <div
                                id="FileUpload"
                                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                            >
                                <input
                                    type="file" onChange={handleFileChange}
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                fill="#3C50E0"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                fill="#3C50E0"
                                            />
                                        </svg>
                                    </span>
                                    <p>
                                        <span className="text-primary">Click to upload</span> or
                                        drag and drop
                                    </p>
                                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                    <p>(max, 800 X 800px)</p>
                                </div>
                            </div>
                        </div>

                        {imageUrl && (
                            <div>
                                <label htmlFor="image">Brand Image</label>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <img src={imageUrl} alt="brand image" className="w-[200px] object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl("")}
                                            className="absolute top-0 right-0 p-1 text-white bg-red-600 rounded-full"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="mt-5 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none">
                            Add Brand
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default AddBrand;
