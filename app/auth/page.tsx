"use client";

import { AUTH_COOKIE_NAME } from "@/util/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import FakeIntro from "./motion";

export const dynamic = "force-dynamic";

function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cookiesValue, setCookiesValue] = useState(
    searchParams.get("auth") || ""
  );

  const getLoginUrl = async () => {
    const res = await fetch("/api/samlGenerator");
    if (!res.ok) {
      throw new Error("Failed to generate SAML request");
    }
    const { url } = await res.json();
    return url;
  };

  const clickHandler = async () => {
    const url = new URL(decodeURI(await getLoginUrl()));
    const params = new URLSearchParams(url.search);
    params.set("RelayState", `${window.location.origin}/auth/`);
    url.search = params.toString();
    router.push(url.toString()); // Redirect to home page after saving cookie
  };

  return (
    <div className="max-w-xl mx-auto my-16 p-6 border rounded shadow-md">
      <FakeIntro onContinue={clickHandler} />
      {/* <h1 className="text-xl font-bold mb-4">Set ESS cookies</h1> */}
      <form className="flex flex-col space-y-4">
        {/* <label htmlFor="inputValue" className="font-semibold">
          Enter value to store in cookie:
        </label> */}

        <div className="flex items-center gap-3 mt-6 w-full">
          <div
            className="flex items-center gap-2 flex-1 px-4 py-2 rounded-md border border-green-500
                  shadow-[0_0_12px_#22c55e,0_0_24px_#22c55e]
                  bg-black text-green-400 text-sm font-mono"
          >
            <span className="text-lg">🧙‍♂️</span>
            <input
              id="inputValue"
              type="text"
              name="cookiesValue"
              value={cookiesValue}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCookiesValue(e.target.value);
              }}
              className="flex-1 bg-transparent focus:outline-none placeholder:text-green-700 text-green-300"
              placeholder="Manual Magic Code Recovery Input"
            />
          </div>

          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center rounded-md 
             border-2 border-green-400 text-xl text-green-200 
             bg-transparent 
             shadow-[0_0_10px_#22c55e,0_0_22px_#22c55e,0_0_34px_#22c55e] 
              animate-[pulse_1.2s_ease-in-out_infinite]
             transition-all duration-300 cursor-pointer"
            title="Activate Cookie Magic"
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              const formElement = e.currentTarget.form;
              if (!formElement) {
                alert("Form element not found.");
                return;
              }
              const formData = new FormData(formElement);
              const value = formData.get("cookiesValue") as string;

              if (!value) {
                alert("Please enter a value to save in the cookie.");
                return;
              }
              document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
                value
              )}; path=/; max-age=${60 * 60 * 24 * 7}`;
              alert("Cookie saved!");
              router.push("/"); // Redirect to home page after saving cookie
            }}
          >
            🍪
          </button>
        </div>
      </form>
      {/* <div className="flex justify-center mt-4">
        <button
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
          onClick={clickHandler}
        >
          Magic Link
        </button>
      </div> */}
    </div>
  );
}

export default function Page() {
  return <Auth />;
}
