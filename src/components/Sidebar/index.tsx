"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
              fill=""
            />
            <path
              d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
              fill=""
            />
            <path
              d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
              fill=""
            />
            <path
              d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
              fill=""
            />
          </svg>
        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
              fill=""
            />
            <path
              d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
              fill=""
            />
          </svg>
        ),
        label: "Administrator",
        route: "/administrator",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z"
              fill=""
            />
          </svg>
        ),
        label: "Products",
        route: "/products",
      },
      {
        icon: (
          <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4.815,7.8H9.6a1.8,1.8,0,0,1,0,3.6H4.814a1.8,1.8,0,0,1,0-3.6Zm2.993-3a1.8,1.8,0,0,0,1.8,1.8h1.8V4.8a1.8,1.8,0,1,0-3.594,0Zm11.377,3a1.8,1.8,0,0,0-1.8,1.8v1.8h1.8a1.8,1.8,0,0,0,0-3.6ZM16.192,9.6V4.8a1.8,1.8,0,1,0-3.593,0V9.6a1.8,1.8,0,1,0,3.593,0Zm4.79,4.8a1.8,1.8,0,0,0-1.8-1.8H14.4a1.8,1.8,0,0,0,0,3.6h4.79A1.8,1.8,0,0,0,20.982,14.4Zm-8.384,3v1.8a1.8,1.8,0,1,0,1.8-1.8Zm-4.79-3v4.8a1.8,1.8,0,1,0,3.593,0V14.4a1.8,1.8,0,1,0-3.593,0Zm-4.79,0a1.8,1.8,0,1,0,3.593,0V12.6h-1.8A1.8,1.8,0,0,0,3.018,14.4Z"></path></g></svg>
        ),
        label: "Brands",
        route: "/brands",
      },
      {
        icon: (
          <svg width="18px" height="18px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 6C3 4.34315 4.34315 3 6 3H7C8.65685 3 10 4.34315 10 6V7C10 8.65685 8.65685 10 7 10H6C4.34315 10 3 8.65685 3 7V6Z" stroke="#ffffff" stroke-width="2"></path> <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V7C21 8.65685 19.6569 10 18 10H17C15.3431 10 14 8.65685 14 7V6Z" stroke="#ffffff" stroke-width="2"></path> <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" stroke="#ffffff" stroke-width="2"></path> <path d="M3 17C3 15.3431 4.34315 14 6 14H7C8.65685 14 10 15.3431 10 17V18C10 19.6569 8.65685 21 7 21H6C4.34315 21 3 19.6569 3 18V17Z" stroke="#ffffff" stroke-width="2"></path> </g></svg>
        ),
        label: "Categories",
        route: "/categories",
      },
      {
        icon: (
          <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z"></path></g></svg>
        ),
        label: "Sub Categories",
        route: "/sub-categories",
      },
      {
        icon: (
          <svg width="18px" height="18px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Editable-line" version="1.1"  xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d=" M16.842,3.548l3.29,6.984c0.137,0.29,0.401,0.491,0.707,0.538l7.357,1.12c0.77,0.117,1.077,1.108,0.52,1.677l-5.324,5.436 c-0.221,0.226-0.322,0.551-0.27,0.87l1.257,7.676c0.131,0.803-0.673,1.416-1.362,1.036l-6.58-3.624c-0.273-0.151-0.6-0.151-0.873,0 l-6.58,3.624c-0.688,0.379-1.493-0.233-1.362-1.036l1.257-7.676c0.052-0.319-0.049-0.644-0.27-0.87l-5.324-5.436 c-0.557-0.569-0.25-1.56,0.52-1.677l7.357-1.12c0.306-0.047,0.57-0.248,0.707-0.538l3.29-6.984 C15.503,2.817,16.497,2.817,16.842,3.548z" fill="none" id="XMLID_16_" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path></g></svg>
        ),
        label: "Featured Products",
        route: "/featured-products",
      },
      {
        icon: (
         <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="garbage_cleaning_properly"> <path d="M462.08,71.69H420.34a19.2,19.2,0,0,0-19.16,19.2v97.63H327.09c-2.66-1.76-5.4-3.43-8.19-5V90.89a19.2,19.2,0,0,0-19.16-19.2H258a19.2,19.2,0,0,0-19.16,19.2v77.43a129.14,129.14,0,0,0-26.93,6.6A69.16,69.16,0,0,0,198.83,142l-43-58.36v-22h13.62a7,7,0,0,0,7-7v-27A19.35,19.35,0,0,0,157.11,8.3H89.32A19.35,19.35,0,0,0,70,27.63v27a7,7,0,0,0,7,7H89.37V85.71l-42.29,56a70.14,70.14,0,0,0-14.09,42V462.93a39.93,39.93,0,0,0,39.88,39.88h99.69a39.93,39.93,0,0,0,39.88-39.88V418.47a128.23,128.23,0,0,0,26.4,6.42V470.5a32.3,32.3,0,0,0,32.21,32.31H449a32.29,32.29,0,0,0,32.2-32.31V90.89A19.19,19.19,0,0,0,462.08,71.69Zm-61,130.83a15.78,15.78,0,0,1-15.62,14H357.56a130.11,130.11,0,0,0-12.79-14Zm-29.64,94.09A115.42,115.42,0,1,1,256,181.19,115.55,115.55,0,0,1,371.42,296.61Zm-118.58-186h30a7,7,0,0,0,0-14h-30V90.89a5.19,5.19,0,0,1,5.16-5.2h41.74a5.19,5.19,0,0,1,5.16,5.2v85.9a128.62,128.62,0,0,0-48.9-9.6c-1.06,0-2.11,0-3.16,0ZM84,47.65v-20a5.33,5.33,0,0,1,5.33-5.33h67.79a5.33,5.33,0,0,1,5.33,5.33v20H84Zm57.83,14V75.1H103.37V61.65Zm56.62,401.28a25.91,25.91,0,0,1-25.88,25.88H167.5l9.65-16.14a7,7,0,0,0-12-7.19l-14,23.33h-19.6V469.07a7,7,0,0,0-14,0v19.74H98L84,465.48a7,7,0,1,0-12,7.19l9.65,16.14h-8.8A25.91,25.91,0,0,1,47,462.93V349.54h62.56a7,7,0,1,0,0-14H47V281.9h62.56a7,7,0,1,0,0-14H47V183.76a56.11,56.11,0,0,1,11.26-33.6L104.36,89.1h38.11l45.09,61.18a55.32,55.32,0,0,1,10.81,30.47,129.38,129.38,0,0,0,.07,231.75ZM449,488.81h-178a18.26,18.26,0,0,1-18.15-17.13H467.17A18.25,18.25,0,0,1,449,488.81Zm18.2-31.13H252.84V426c1,0,2.1,0,3.16,0A129.37,129.37,0,0,0,367.21,230.48h18.23a29.82,29.82,0,0,0,29.74-29.83v-90h30a7,7,0,1,0,0-14h-30V90.89a5.19,5.19,0,0,1,5.16-5.2h41.74a5.18,5.18,0,0,1,5.15,5.2Z"></path> <path d="M235.92,230.2v44.28h-21.4a16.21,16.21,0,0,0-16.12,14.39l-2.14,19h0l-1.35,12c-.83,7.39-4.48,14.64-10.84,21.57a12.7,12.7,0,0,0,9.33,21.3h107a18,18,0,0,0,18-19.32l-2.56-35.12h0l-1.36-18.74a16.27,16.27,0,0,0-16.17-15H277.21V230.2a20.65,20.65,0,1,0-41.29,0Zm69.46,114.11a5,5,0,0,1-5,5.38h-9.31l-1.24-14.82a6.5,6.5,0,0,0-13,1.09L278,349.69H260.61V335.42a6.5,6.5,0,1,0-13,0v14.27H230.2L231.36,336a6.5,6.5,0,0,0-13-1.09l-1.24,14.82H194.1c8-8.86,12.6-18.41,13.73-28.41l.7-6.2,94.73.13Zm-7.12-56.83a3.22,3.22,0,0,1,3.2,3l.86,11.75L210,302.09l1.32-11.76a3.21,3.21,0,0,1,3.2-2.85ZM248.92,230.2a7.65,7.65,0,1,1,15.29,0v42.13H248.92Z"></path> </g> </g></svg>
        ),
        label: "Cleaning Sectors",
        route: "/cleaning-sectors",
      },
      {
        icon: (
          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 8C18 5.17157 18 3.75736 17.1213 2.87868C16.2426 2 14.8284 2 12 2C9.17157 2 7.75736 2 6.87868 2.87868C6 3.75736 6 5.17157 6 8V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22C14.8284 22 16.2426 22 17.1213 21.1213C18 20.2426 18 18.8284 18 16V12" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M18 19.5C19.4001 19.5 20.1002 19.5 20.635 19.2275C21.1054 18.9878 21.4878 18.6054 21.7275 18.135C22 17.6002 22 16.9001 22 15.5V8.5C22 7.09987 22 6.3998 21.7275 5.86502C21.4878 5.39462 21.1054 5.01217 20.635 4.77248C20.1002 4.5 19.4001 4.5 18 4.5" stroke="#ffffff" stroke-width="1.5"></path> <path d="M6 19.5C4.59987 19.5 3.8998 19.5 3.36502 19.2275C2.89462 18.9878 2.51217 18.6054 2.27248 18.135C2 17.6002 2 16.9001 2 15.5V8.5C2 7.09987 2 6.3998 2.27248 5.86502C2.51217 5.39462 2.89462 5.01217 3.36502 4.77248C3.8998 4.5 4.59987 4.5 6 4.5" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>
        ),
        label: "Slider",
        route: "/slider",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link className="flex gap-2 items-center" href="/">
            <Image
              width={50}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
              className="bg-white p-2 rounded"
            />
            <p className="text-white text-lg font-bold">Pearl Hygiene Admin</p>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-4 py-4 lg:mt-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
