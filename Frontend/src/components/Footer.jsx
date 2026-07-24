import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20">

      <div
        className="
        max-w-7xl
        mx-auto
        px-5
        sm:px-8
        lg:px-10
        py-12
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-10
        "
      >

        {/* Brand */}

        <div className="text-center sm:text-left">

          <h2 className="
            text-3xl
            sm:text-4xl
            font-bold
            text-yellow-500
            mb-4
          ">
            ScentAura
          </h2>


          <p className="
            text-gray-400
            leading-relaxed
            text-sm
            sm:text-base
          ">
            Discover luxury fragrances crafted to express
            your personality and create unforgettable moments.
          </p>

        </div>



        {/* Quick Links */}

        <div className="text-center sm:text-left">

          <h3 className="
            text-xl
            font-semibold
            text-yellow-500
            mb-5
          ">
            Quick Links
          </h3>


          <ul className="space-y-3 text-gray-300">

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Home
            </li>

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Perfumes
            </li>

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Wishlist
            </li>

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Cart
            </li>

          </ul>

        </div>




        {/* Support */}

        <div className="text-center sm:text-left">

          <h3 className="
            text-xl
            font-semibold
            text-yellow-500
            mb-5
          ">
            Support
          </h3>


          <ul className="space-y-3 text-gray-300">

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Contact Us
            </li>

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Privacy Policy
            </li>

            <li className="hover:text-yellow-500 transition cursor-pointer">
              Terms & Conditions
            </li>

          </ul>

        </div>




        {/* Social */}

        <div className="text-center sm:text-left">

          <h3 className="
            text-xl
            font-semibold
            text-yellow-500
            mb-5
          ">
            Follow Us
          </h3>


          <div className="
            flex
            justify-center
            sm:justify-start
            gap-5
            text-2xl
          ">

            <FaInstagram
              className="
              hover:text-yellow-500
              transition
              cursor-pointer
              "
            />


            <FaFacebookF
              className="
              hover:text-yellow-500
              transition
              cursor-pointer
              "
            />


            <FaTwitter
              className="
              hover:text-yellow-500
              transition
              cursor-pointer
              "
            />

          </div>

        </div>


      </div>



      {/* Bottom */}

      <div
        className="
        border-t
        border-gray-800
        py-5
        px-4
        text-center
        text-sm
        sm:text-base
        text-gray-400
        "
      >

        © 2026 ScentAura. All Rights Reserved.

      </div>


    </footer>
  );
};


export default Footer;