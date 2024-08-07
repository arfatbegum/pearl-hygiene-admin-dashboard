"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import firebaseConfig from "@/js/firebaseConfig";
import imgbbAPIKey from "@/js/imgbbConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [specifications, setSpecifications] = useState([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [files, setFiles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            const isLoggedInLocalStorage = localStorage.getItem('isLoggedIn');
            if (!user || isLoggedInLocalStorage !== 'true') {
                window.location.href = '../';
            }
        });

        const fetchBrands = async () => {
            const brandsRef = ref(database, 'brands');
            const snapshot = await get(brandsRef);
            const brandsData = snapshot.val();
            if (brandsData) {
                setBrands(Object.keys(brandsData));
            }
        };

        const fetchCategories = async () => {
            const categoriesRef = ref(database, 'categories');
            const snapshot = await get(categoriesRef);
            const categoriesData = snapshot.val();
            console.log(categoriesData)
            if (categoriesData) {
                setCategories(Object.values(categoriesData));
            }
        };

        fetchBrands();
        fetchCategories();
    }, []);

    const handleFiles = (files: any) => {
        if (files.length > 0) {
            const imageFiles = Array.from(files);
            setFiles(imageFiles);

            const previewImages = imageFiles.map((file, index) => (
                <div key={index} className="">
                    <img src={URL.createObjectURL(file)} alt="Product Image" width="300px" />
                    <div>
                        <input type="checkbox" id={`select-${index}`} name={`select-${index}`} value={`select-${index}`} onChange={() => setPrimaryIndex(index)} />
                        <label htmlFor={`select-${index}`}>Primary Image</label>
                    </div>
                </div>
            ));

            document.getElementById('imgPreviewDiv').innerHTML = previewImages;
        }
    };

    const uploadToImgBB = async (file: any) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data.data.url;
    };

    const uploadImage = async () => {
        if (files.length > 0) {
            setLoading(true);
            const imageUrls = [];

            const imageFiles = [...files];
            [imageFiles[0], imageFiles[primaryIndex]] = [imageFiles[primaryIndex], imageFiles[0]];

            await Promise.all(imageFiles.map(async (file) => {
                try {
                    const url = await uploadToImgBB(file);
                    imageUrls.push(url);
                } catch (error) {
                    alert('Failed to upload image. Please try again later.');
                    throw error;
                }
            }));

            uploadToDatabase(imageUrls);
        } else {
            Swal.fire("Error!", "Please Select an image file", "error");
        }
    };

    const uploadToDatabase = async (imageUrls: any) => {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        const productsData = snapshot.val();

        let nextId = 1;
        if (productsData) {
            const ids = Object.keys(productsData).map((key) => parseInt(key, 10));
            nextId = Math.max(...ids) + 1;
        }

        const newProductRef = ref(database, `products/${nextId}`);
        const productData = {
            productName,
            productCategory,
            productSubCategory,
            productDescription,
            productCode,
            productBrand,
            images: imageUrls,
            specifications,
        };

        set(newProductRef, productData)
            .then(() => {
                Swal.fire("Success!", 'Product uploaded successfully!');
                setLoading(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((error) => {
                Swal.fire("Error!", 'Failed to upload product. Please try again later.');
                setLoading(false);
            });
    };

    const addSpecification = () => {
        const field = document.getElementById('specification_field').value;
        const value = document.getElementById('specification_value').value;

        if (field && value) {
            setSpecifications([...specifications, { field, value }]);
            document.getElementById('specification_field').value = '';
            document.getElementById('specification_value').value = '';
        } else {
            Swal.fire("Error!", 'Please enter both specification field and value...', "error");
        }
    };
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Upload Product
                    </h3>
                </div>
                <form action="#">
                    <div className="p-6.5">
                        <div className="mb-4.5 w-full">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Product Name
                            </label>
                            <input
                                type="text" id="product_name" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Product Code
                                </label>
                                <input
                                    type="text" id="product_code" placeholder="Product Code" value={productCode} onChange={(e) => setProductCode(e.target.value)}
                                    name="product_code"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Brand
                                    </label>

                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <select
                                            id="product_brand" value={productBrand} onChange={(e) => setProductBrand(e.target.value)}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
                                                }`}
                                        >
                                            <option value="" disabled className="text-body dark:text-bodydark">
                                                Select Brand
                                            </option>
                                            {brands.map((brand, index) => (
                                                <option key={index} value={brand}>{brand}</option>
                                            ))}
                                        </select>

                                        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                            <svg
                                                className="fill-current"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.8">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                        fill="#344952"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Product Category
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
                                            }`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select Category
                                        </option>
                                        {Array.isArray(categories) && categories.length > 0 ? (
                                            categories.map((category, index) => (
                                                <option key={index} value={typeof category === 'string' ? category : category.name}>
                                                    {typeof category === 'string' ? category : category.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No categories available</option>
                                        )}
                                    </select>

                                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                        <svg
                                            className="fill-current"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.8">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill="#344952"
                                                />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Sub-Category
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={productSubCategory}
                                        onChange={(e) => setProductSubCategory(e.target.value)}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}>
                                        <option value="" disabled>Select Sub-Category</option>
                                        {categories.subCategories && categories.subCategories.length > 0 ? (
                                            categories.subCategories.map((subCategory: string, index: number) => (
                                                <option key={index} value={subCategory}>{subCategory}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No subcategories</option>
                                        )}
                                    </select>

                                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                        <svg
                                            className="fill-current"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.8">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                    fill="#344952"
                                                />
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Product Description
                            </label>
                            <textarea
                                id="product_description" placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
                                name="product_description"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Specifications
                            </label>
                            <input
                                type="text" id="specification_field" placeholder="Specification Field"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                            />
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Specifications
                            </label>
                            <input
                                type="text" id="specification_value" placeholder="Specification Value"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                            />
                        </div>

                        <button
                            type="button"
                            onClick={addSpecification} className="my-3 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                        >Add Specification</button>
                        <div>
                            {specifications.map((spec, index) => (
                                <div key={index} className="">
                                    <p>{spec.field}: {spec.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Images
                            </label>
                            <input
                                type="file" id="product_images" multiple onChange={(e) => handleFiles(e.target.files)}

                            />

                        </div>
                        <div className="mb-6">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Select Primary Image
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {files.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview ${index}`}
                                            className={`h-24 w-24 object-cover rounded border-2 ${index === primaryIndex ? 'border-primary' : 'border-transparent'
                                                }`}
                                            onClick={() => setPrimaryIndex(index)}
                                        />
                                        {index === primaryIndex && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">
                                                Primary
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="mt-5 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                            onClick={uploadImage}
                        >
                            Upload Product
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default AddProduct;
