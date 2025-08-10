import React, { useState, type FormEvent } from "react";

const FormPage = () => {
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // for now we just log it; you can replace this with whatever you need
    console.log("Submitted name:", name);

    fetch("/api/test-data", {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Inform the server that the request body is JSON
      },
      body: JSON.stringify(name), // Convert the JavaScript object to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response from the server
      })
      .then((savedData) => {
        console.log("Data saved successfully:", savedData);
        setName(""); // Clear the input field after submission
        // You can now update your frontend state with the new data
        // e.g., setTestData((prevData) => [...prevData, savedData]);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        // Handle errors, such as displaying an error message to the user
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-blue-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add Your Name</h2>

        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPage;
