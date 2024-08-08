"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import firebaseConfig from "@/js/firebaseConfig";
import imgbbAPIKey from "@/js/imgbbConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const UpdateProduct = ({ params }: any) => {
    const [product, setProduct] = useState({});
    const [specifications, setSpecifications] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [subCategories, setSubCategories] = useState([]);
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            const isLoggedInLocalStorage = localStorage.getItem('isLoggedIn');
            if (!user || isLoggedInLocalStorage !== 'true') {
                router.push('/');
            }
        });

        if (id) {
            getProductById(id);
            getBrandsFromFirebase();
            getCategoriesFromFirebase();
        }
    }, [id]);


    const getProductById = (productId: any) => {
        const productsRef = ref(database, `products/${productId}`);
        get(productsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const productData = snapshot.val();
                    setProduct(productData);
                    setSpecifications(productData.specifications || []);
                    setImageUrls(productData.images || []);
                    setSelectedCategory(productData.productCategory || {});
                    setPrimaryIndex(0); // Reset primary index
                } else {
                    alert(`No product found with ID: ${productId}`);
                }
            })
            .catch((error) => console.error('Error getting product data:', error));
    };

    const getBrandsFromFirebase = () => {
        const brandsRef = ref(database, 'brands');
        get(brandsRef).then((snapshot) => {
            const brandsData = snapshot.val();
            if (brandsData) {
                 // @ts-ignore
                setBrands(Object.keys(brandsData));
            }
        });
    };

    const getCategoriesFromFirebase = () => {
        const categoriesRef = ref(database, 'categories');
        get(categoriesRef).then((snapshot) => {
            const categoriesData = snapshot.val();
            if (categoriesData) {
                setCategories(Object.values(categoriesData));
            }
        });
    };

    const handleSpecificationAdd = () => {
         // @ts-ignore
        const field = document.getElementById('specification_field').value;
         // @ts-ignore
        const value = document.getElementById('specification_value').value;
        if (field && value) {
             // @ts-ignore
            setSpecifications([...specifications, { field, value }]);
             // @ts-ignore
            document.getElementById('specification_field').value = '';
             // @ts-ignore
            document.getElementById('specification_value').value = '';
        } else {
            console.log('Please enter both specification field and value...')
        }
    };

    const handleSpecificationDelete = (index: any) => {
        if (confirm('Are you sure you want to delete this specification?')) {
            const updatedSpecifications = [...specifications];
            updatedSpecifications.splice(index, 1);
            setSpecifications(updatedSpecifications);
        } else {
            alert('Delete Cancelled');
        }
    };

    const handleImageDelete = (index: any) => {
        if (confirm('Are you sure you want to delete this image?')) {
            const updatedImages = [...imageUrls];
            updatedImages.splice(index, 1);
            setImageUrls(updatedImages);
        } else {
            alert('Delete Cancelled');
        }
    };

    const handlePrimaryImageChange = (index: any) => {
        setPrimaryIndex(index);
    };

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        const updatedProduct = {
            ...product,
            specifications,
            images: imageUrls,
            primaryImage: imageUrls[primaryIndex],
        };
        const productsRef = ref(database, `products/${id}`);
        update(productsRef, updatedProduct)
            .then(() => {
                alert('Product data updated successfully');
            })
            .catch((error) => {
                alert(`Error updating product data: ${error}`);
            });
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
                <form onSubmit={handleFormSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5 w-full">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="product_name"
                                name="product_name"
                                 // @ts-ignore
                                value={product.productName || ''}
                                onChange={(e) => setProduct({ ...product, productName: e.target.value })}
                                placeholder="Product Name"
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Product Code
                                </label>
                                <input
                                    type="text"
                                    id="product_code"
                                    name="product_code"
                                     // @ts-ignore
                                    value={product.productCode || ''}
                                    onChange={(e) => setProduct({ ...product, productCode: e.target.value })}
                                    placeholder="Product Code"
                                    required
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
                                            id="product_brand"
                                            name="product_brand"
                                             // @ts-ignore
                                            value={product.productBrand || ''}
                                            onChange={(e) => setProduct({ ...product, productBrand: e.target.value })}
                                            required
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
                                                }`}
                                        >
                                            <option value="" disabled className="text-body dark:text-bodydark">
                                                Select Brand
                                            </option>
                                            {brands.map((brand, index) => (
                                                <option key={index} value={brand}>
                                                    {brand}
                                                </option>
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
                        <label htmlFor="product_price">Price</label>
                        <input
                            type="text"
                            id="product_price"
                            name="product_price"
                             // @ts-ignore
                            value={product.productPrice || ''}
                            onChange={(e) => setProduct({ ...product, productPrice: e.target.value })}
                            placeholder="Product Price"
                            required
                        />

                        <label htmlFor="product_discount">Discount (%)</label>
                        <input
                            type="number"
                            id="product_discount"
                            name="product_discount"
                             // @ts-ignore
                            value={product.productDiscount || ''}
                            onChange={(e) => setProduct({ ...product, productDiscount: e.target.value })}
                            placeholder="Product Discount (%)"
                            required
                        />

                        <label htmlFor="product_stock">Stock</label>
                        <input
                            type="number"
                            id="product_stock"
                            name="product_stock"
                             // @ts-ignore
                            value={product.productStock || ''}
                            onChange={(e) => setProduct({ ...product, productStock: e.target.value })}
                            placeholder="Product Stock"
                            required
                        />

                        <div className="">
                            <div className="">

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
                                    onClick={handleSpecificationAdd} className="my-3 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                                >Add Specification</button>

                            </div>
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex flex-row gap-6">
                                    <input
                                        type="text"
                                         // @ts-ignore
                                        value={spec.field}
                                        className="w-5/12 mb-4.5 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => {
                                            const updatedSpecs = [...specifications];
                                             // @ts-ignore
                                            updatedSpecs[index].field = e.target.value;
                                            setSpecifications(updatedSpecs);
                                        }}
                                    />
                                    <input
                                        type="text"
                                         // @ts-ignore
                                        value={spec.value}
                                        className="w-5/12 mb-4.5 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => {
                                            const updatedSpecs = [...specifications];
                                             // @ts-ignore
                                            updatedSpecs[index].value = e.target.value;
                                            setSpecifications(updatedSpecs);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSpecificationDelete(index)}
                                    >
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
                                        </svg></button>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Product Category
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        id="product_category"
                                        name="product_category"
                                         // @ts-ignore
                                        value={selectedCategory.categoryId || ''}
                                        onChange={(e) => {
                                             // @ts-ignore
                                            const category = categories.find((cat) => cat.categoryId === e.target.value);
                                             // @ts-ignore
                                            setSelectedCategory(category);
                                             // @ts-ignore
                                            setSubCategories(category.subCategories || []);
                                        }}

                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
                                            }`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select Category
                                        </option>
                                        {categories.map((category) => (
                                             // @ts-ignore
                                            <option key={category.id} value={category.id}>
                                                 {/* @ts-ignore */}
                                                {category.name}
                                            </option>
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

                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Sub-Category
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        id="product_subcategory"
                                        name="product_subcategory"
                                         // @ts-ignore
                                        value={product.productSubcategory || ''}
                                        onChange={(e) => setProduct({ ...product, productSubcategory: e.target.value })}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
                                            }`}>
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select Sub-Category
                                        </option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory} value={subCategory}>
                                                {subCategory}
                                            </option>
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

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Product Description
                            </label>
                            <textarea
                                id="product_description"
                                name="product_description"
                                 // @ts-ignore
                                value={product.productDescription || ''}
                                onChange={(e) => setProduct({ ...product, productDescription: e.target.value })}
                                placeholder="Product Description"
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Images
                            </label>
                            <input
                                type="file"
                                id="image_upload"
                                onChange={(e) => {
                                     // @ts-ignore
                                    const file = e.target.files[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('image', file);
                                        fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
                                            method: 'POST',
                                            body: formData,
                                        })
                                            .then((response) => response.json())
                                            .then((result) => {
                                                if (result.success) {
                                                     // @ts-ignore
                                                    setImageUrls([...imageUrls, result.data.url]);
                                                }
                                            })
                                            .catch((error) => console.error('Error uploading image:', error));
                                    }
                                }}
                            />

                        </div>

                        <label htmlFor="images">Product Images</label>
                        <div className="flex gap-5">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="">
                                    <img className="mb-5" src={url} alt={`Product Image ${index}`} width="100" height="100" />
                                    <button className="mr-3" type="button" onClick={() => handleImageDelete(index)}>
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
                                    <input
                                        type="radio"
                                        name="primaryImage"
                                        checked={index === primaryIndex}
                                        onChange={() => handlePrimaryImageChange(index)}
                                    />
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="mt-5 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                        >Update</button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default UpdateProduct;
