"use client";

import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Set ESS cookies</h1>

      <form className="flex flex-col space-y-4">
        <label htmlFor="inputValue" className="font-semibold">
          Enter value to store in cookie:
        </label>
        <input
          id="inputValue"
          type="text"
          name="cookiesValue"
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
            document.cookie = `ess_token=${encodeURIComponent(
              value
            )}; path=/; max-age=${60 * 60 * 24 * 7}`;
            alert("Cookie saved!");
            router.push("/"); // Redirect to home page after saving cookie
          }}
        >
          Save to Cookie
        </button>
      </form>
    </div>
  );
}
