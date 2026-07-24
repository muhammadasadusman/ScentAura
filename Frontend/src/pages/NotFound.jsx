import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();


  return (

    <div
      className="
      min-h-[70vh]
      flex
      flex-col
      items-center
      justify-center
      text-center
      px-5
      "
    >

      <h1
        className="
        text-7xl
        sm:text-8xl
        font-bold
        text-yellow-500
        "
      >
        404
      </h1>


      <h2
        className="
        text-3xl
        sm:text-4xl
        font-bold
        mt-5
        "
      >
        Page Not Found
      </h2>


      <p
        className="
        text-gray-500
        max-w-md
        mt-4
        "
      >
        Sorry, the page you are looking for
        does not exist or has been moved.
      </p>


      <button
        onClick={() => navigate("/")}
        className="
        mt-8
        bg-yellow-500
        hover:bg-yellow-600
        text-black
        font-semibold
        px-8
        py-3
        rounded-lg
        transition
        "
      >
        Go Home
      </button>


    </div>

  );
};


export default NotFound;