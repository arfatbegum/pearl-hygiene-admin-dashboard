"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import firebaseConfig from "@/js/firebaseConfig";
import imgbbAPIKey from "@/js/imgbbConfig";
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
    const [image, setImage] = useState(null);
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

    const handleFileChange = (e) => {
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

    const handleSubmit = async (e) => {
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
        const newBrandRef = push(brandsRef); // Generate a new key
        set(newBrandRef, newBrand)
            .then(() => {
                Swal.fire("Success!", "Brand added successfully", "success");
                router.push('/brands');
            })
            .catch((error) => {
                Swal.fire("Error!", error.message, "error");
            });
    };

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
                                Brand Description
                            </label>
                            <textarea
                                value={brandDetails}
                                onChange={(e) => setBrandDetails(e.target.value)}
                                placeholder="Brand Description"
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
                                Images
                            </label>
                            <input type="file" onChange={handleFileChange} />
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
