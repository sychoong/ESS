"use client";

import { AUTH_COOKIE_NAME } from "@/util/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import TokenFetcher from "./TokenFetcher";

function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cookiesValue, setCookiesValue] = useState(
    searchParams.get("auth") || ""
  );

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Set ESS cookies</h1>
      <TokenFetcher></TokenFetcher>
      <form className="flex flex-col space-y-4">
        <label htmlFor="inputValue" className="font-semibold">
          Enter value to store in cookie:
        </label>
        <input
          id="inputValue"
          type="text"
          name="cookiesValue"
          value={cookiesValue}
          onChange={(e) => {
            e.preventDefault();
            setCookiesValue(e.target.value);
          }}
          className="border rounded px-3 py-2"
          placeholder="Type something..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={async (e) => {
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
          Save to Cookie
        </button>
      </form>
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full"
          onClick={() => {
            const url = new URL(
              decodeURI(
                "https://login.microsoftonline.com/69857f89-851d-4f06-8114-84e781ee13e2/saml2?SAMLRequest=rVNLj9owEL7vr0C5m5AXcSxAotAHEgUEaQ%2B9VI4z2bXk2Knt7LL%2Fvk7CLrSqONWXSOP5Hv4yMzO0Fg1ZtvZJHuFXC8Y%2BjNw510Ia0l%2FOvVZLoqjhhkhagyGWkdPy65aE4wlptLKKKeH9BbuPosaAtlzJAbZZz7397uN2%2F3mz%2B1lkcZTgNApYGGY4nmRZGmGaBjRNClxURTTFGcVVNUC%2FgzaOZ%2B452qFy0OqZl6B3TnXu5VSAtEyotrxoGdPCRhpLpXWoSZigyRRNknySkCQiCf4x9K1dFFxS25M%2FWdsY4vtCPXI5rjnTyqjKKim4hDFTtT%2FNcJJWOEM4CUoUV44TB0GMcAwpDgCCCEK%2FCyZ8d9nn9oHLksvH%2B3EVQ5MhX%2FL8gA77Uz6QLN9iXClp2hr0CfQzZ%2FDtuL16Zu79mgpEGz621zTGlA9%2B%2FAgHJSRVhYIqiVEcQ4loEYYoy8KAFZiFrIh8yoy36EVnHYr0MerF%2FxWpwdKSWjrzbzWuqg3pfupmfVCCs9e%2B3p1PStfU3o%2Bwq%2FASVX0rabqpMdbZ9N5ZlkKol5UGat3YWN2CN%2FL%2F0L7sB5T9trjILZztaKXqhmpuujGBM2X2EtM1qtv2lXCjf4RqcXc7GGFdnysf3OdF6bIbF2BOO9dUmkZpe8non%2BSDa%2F%2BO7cXD2%2FXt6i9%2BAw%3D%3D&RelayState=https%3A%2F%2Flocalhost%2Fauth%2F"
              )
            );
            const params = new URLSearchParams(url.search);
            params.set("RelayState", `${process.env.NEXT_PUBLIC_BASE}/auth/`);
            url.search = params.toString();
            router.push(url.toString()); // Redirect to home page after saving cookie
          }}
        >
          Magic Link
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Auth />
    </Suspense>
  );
}
