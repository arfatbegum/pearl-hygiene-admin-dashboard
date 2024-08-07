"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import firebaseConfig from "@/js/firebaseConfig";

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const SignIn: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      // Check the Firebase Realtime Database for user credentials
      const usersRef = ref(database, 'admin_users');
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();

      console.log('Fetched users data:', usersData);

      if (usersData) {

          if (usersData && usersData[username] && usersData[username].password == password) {
            // Sign in with Firebase Authentication
            try {
              const email = usersData[username].email;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
              console.log(userCredential);
              
              if (userCredential) {
                // Store login state and user data in local storage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({ username: username, password: usersData[username]["password"] }));
    
                // Redirect to the dashboard after a delay
                setTimeout(() => {
                  router.push('/');
                }, 1200); 
                }

              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('currentUser', JSON.stringify({ username, password }));

             
            } catch (authError) {
              console.error('Error signing in:', authError);
              setLoginError("Login failed. Please check your email and password.");
            }
          } else {
            console.log("Invalid password.");
            setLoginError("Invalid username or password.");
          }
      
      } else {
        console.log("No user data found.");
        setLoginError("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoginError("Login failed. Please try again later.");
    }
  };


  return (
        <div className="lg:mt-14 mt-6 lg:w-1/3 bg-white my-auto mx-auto border-stroke dark:border-strokedark">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to Pearl Hygiene
            </h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.48126 5.24844 8.13438 6.83594 8.13438H15.8016C17.3891 8.13438 18.7203 9.48126 18.7203 11V17.2563C18.7203 17.3594 18.7203 17.4281 18.6859 17.5313H18.1141Z"
                          fill=""
                        />
                        <path
                          d="M10.9828 13.5844C10.4713 14.0969 10.4713 14.8938 10.9828 15.4063C11.1366 15.56 11.3241 15.6563 11.5453 15.6563C11.7666 15.6563 11.9541 15.56 12.1078 15.4063C12.6203 14.8938 12.6203 14.0969 12.1078 13.5844C11.6203 13.0719 10.8235 13.0719 10.9828 13.5844Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                />
              </div>

              {loginError && (
                <p className="mb-4 text-red-500">{loginError}</p>
              )}
            </form>
          </div>
        </div>
 
  );
};

export default SignIn;
