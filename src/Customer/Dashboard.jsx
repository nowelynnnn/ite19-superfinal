import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // State for categories fetched from the API.
  const [categories, setCategories] = useState([]);
  // State to keep track of the currently displayed banner in the carousel.
  const [currentSlide, setCurrentSlide] = useState(0);

   // List of banner items for the carousel.
  const bannerItems = [
    {
      id: 1,
      image: "banner1.jpg",
    },
    {
      id: 2,
      image: "banner2.jpg",
    },
    {
      id: 3,
      image: "banner3.jpg",
    },
  ];

  //move to the next slide in the carousel.
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerItems.length);
  };

  //move to the previous slide in the carousel.
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerItems.length - 1 : prevSlide - 1
    );
  };

  // Fetch categories from the API when the component loads.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/categories");
        const data = await response.json();
        setCategories(data.data || []); // kuhaon ang categories gikan sa strapi
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []); // aron isa ra ka category mo gawas pag load sa page

  // Automatically move to the next slide in the carousel every 1.5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    {/* Gitawag nato ang navbar para easy */}
      <Navbar />

      <main className="mt-5">
        {/* Tabs Section */}
        <div role="tablist" className="tabs font-bold">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/products" // Navigates to the products page when clicked.
              role="tab"
              className="tab text-lg text-green-700 hover:underline"
              onClick={() =>
                sessionStorage.setItem( // Stores the selected category in sessionStorage/ temporary
                  "selectedCategory",
                  category.category_name
                )
              }
            >
              {category.category_name}
            </Link>
          ))}
        </div>

        {/* Carousel Section */}
        <div className="container mx-auto py-7">
          <div className="carousel w-full">
            {bannerItems.map((item, index) => (
              <div
                key={item.id}
                className={`carousel-item relative w-full ${
                  index === currentSlide ? "block" : "hidden" // Show the current slide, hide others.
                }`}
              >
                <img
                  src={item.image} // Banner image source.
                  alt={item.title}
                  className="h-[350px] w-full object-contain rounded-lg md:h-350px]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-opacity-10"></div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex justify-center py-4 gap-3">
            <button
              className="btn btn-circle bg-green-300 hover:bg-green-500 hover:text-white"
              onClick={prevSlide}
            >
              ❮
            </button>
            <button
              className="btn btn-circle bg-green-300 hover:bg-green-500 hover:text-white"
              onClick={nextSlide}
            >
              ❯
            </button>
          </div>

          {/* Promotional Section */}
          <hr />
          <section className="bg-green-500 mb-5 mt-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row p-5">
                <div className="text-center md:text-left">
                  <h2 className="mb-6 text-2xl font-bold text-white md:text-5xl lg:text-6xl">
                    Your One-Stop Shop <br />
                    for Fresh & Quality Essentials
                  </h2>
                  <button className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-green-500 transition-transform hover:scale-105">
                    Start Shopping
                  </button>
                </div>
                <div className="w-full max-w-md md:w-1/2">
                  <img
                    src="dash.png"
                    alt="Delivery Person on Scooter"
                    className="w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-base-300 py-6">
        <div className="container mx-auto text-center font-bold">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ShopEase Mart. All rights
            reserved.
          </p>
          <div className="mt-2">
            <a href="#" className="hover:underline mx-2">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:underline mx-2">
              Terms of Service
            </a>
            <span>|</span>
            <a href="#" className="hover:underline mx-2">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
