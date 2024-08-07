"use client"; // This should be the very first line

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import firebaseConfig from "@/js/firebaseConfig";
import imgbbAPIKey from "@/js/imgbbConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const AddSector = () => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [sectors, setSectors] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        onAuthStateChanged(auth, (user) => {
            if (!user || isLoggedIn !== 'true') {
                window.location.href = '/';
            } else {
                fetchSectors();
            }
        });
    }, []);

    const fetchSectors = async () => {
        const sectorsRef = ref(database, 'cleaning-sectors');
        const snapshot = await get(sectorsRef);
        if (snapshot.exists()) {
            setSectors(snapshot.val());
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
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

    const handleAddSector = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !details || !imageFile) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        setLoading(true);

        try {
            const imageUrl = await uploadToImgBB(imageFile);
            const newSectorRef = ref(database, 'cleaning-sectors/' + title);

            await set(newSectorRef, {
                details,
                image: imageUrl,
            });

            Swal.fire("Success!", "Sector added successfully", "success");
            setTitle('');
            setDetails('');
            setImageFile(null);
            setImageUrl('');
            fetchSectors();
            router.push("/cleaning-sectors")
        } catch (error) {
            Swal.fire("Error!", "Error adding sector", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cleaning Sectors" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Upload Sector
                    </h3>
                </div>
                <form onSubmit={handleAddSector}>
                    <div className="p-6.5">
                        <div className="mb-4.5 w-full">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Sector Name
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brand Name"
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Sector Details
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Brand Description"
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
                                <label htmlFor="image">Image</label>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <img src={imageUrl} alt="image" className="w-[200px] object-cover" />
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

                        <button
                            type="submit"
                            className="mt-5 inline-flex h-12 items-center justify-center rounded border border-stroke bg-primary py-3 px-6 text-base font-medium text-white transition hover:bg-opacity-90 focus:outline-none"
                        >
                            Upload Sector
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default AddSector;
