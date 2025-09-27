import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // 1. Get the navigate function from the React Router hook
  const navigate = useNavigate();

  // Define the destination page
  const destination = "/admin";

  // 2. Use useEffect to trigger the navigation after a delay
  useEffect(() => {
    // Set a timer for 1000 milliseconds (1 second)
    const timer = setTimeout(() => {
      // This function will be called after the delay
      navigate(destination);
    }, 1000);

    // Clean up the timer if the component unmounts before it fires
    return () => clearTimeout(timer);
  }, [navigate, destination]); // The dependency array ensures this effect runs once

  // Function for the button's onClick event
  const handleButtonClick = () => {
    navigate(destination);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">
        Welcome to the Transport Management System
      </h1>
      <p className="text-gray-700">Use the navigation above to get started.</p>

      {/* 3. Add the button to navigate manually */}
      <button
        onClick={handleButtonClick}
        className="mt-6 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Go to Data Page
      </button>
    </div>
  );
};

export default HomePage;
