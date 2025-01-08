import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { TbShoppingCartCheck } from "react-icons/tb";
import { MdAddShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const Products = () => {
  // Get the selected category from sessionStorage
  const selectedCategory = sessionStorage.getItem("selectedCategory");

  // Get user details from sessionStorage
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  // States for managing data
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Checkout modal visibility
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false); // Order confirmation modal 
  const [selectedProduct, setSelectedProduct] = useState(null); // Product selected for checkout
  const [quantity, setQuantity] = useState(1); // Quantity of the selected product
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(""); // Selected branch filter
  const [isProductAddedModalVisible, setIsProductAddedModalVisible] =
    useState(false); // Product added to cart modal visibility
 
  // Fetch branch data from API
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/branches");
        const data = await response.json();
        setBranches(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchBranch();
  }, []); // Runs only once 

  // Fetch product data based on the selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/products?filters[category_name][$eq]=${selectedCategory}`
        );
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Runs when the selectedCategory changes

  // Filter products based on search query and selected branch
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedBranchId || product.branch_name === selectedBranchId)
  );

  // Adding a product to the cart
  const handleAddToCart = async (product) => {
    const cartData = {
      data: {
        product_name: product.product_name,
        quantity: 1,
        price: product.product_price,
        user_name: userDetails.name,
        branch_name: product.branch_name,
        image: product.image,
      },
    };
    const jsonString = JSON.stringify(cartData);
    try {
      const response = await fetch("http://localhost:1337/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        setIsProductAddedModalVisible(true); // Show confirmation modal
        console.log(data);
      } else {
        const errorData = await response.text();
        alert("Failed to add to cart!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
  };

  // Handle clicking the checkout button
  const handleCheckoutClick = (product) => {
    console.log("Setting selected product for checkout:", product); // Debugging log
    setSelectedProduct(product);
    setIsModalVisible(true); // Show checkout modal
  };

  // Handle confirming the order
  const handleConfirmOrder = async () => {
    if (!selectedProduct) return; // Guard against missing product

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const cartData = {
      data: {
        product_name: selectedProduct.product_name,
        quantity: quantity,
        total: selectedProduct.product_price * quantity,
        customer_name: userDetails.name,
        date: formattedDate,
        branch_name: selectedProduct.branch_name,
      },
    };

    try {
      const response = await fetch("http://localhost:1337/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order data:", data);
        setIsModalVisible(false); // Close modal after confirmation
        setIsConfirmationModalVisible(true); // Show confirmation modal
      } else {
        const errorData = await response.text();
        alert("Failed to confirm order!");
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error during confirmation:", error);
      alert("An error occurred while confirming the order!");
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

   // Close modals
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalVisible(false);
  };

  const closeCartConfirmationModal = () => {
    setIsProductAddedModalVisible(false);
    window.location.reload(); // Refresh the page
  };
  return (
    <>
     {/* Tawagon ang navbar */}
      <Navbar />

      {/* Products Section */}
      <section className="bg-base-200 py-6">
        <div className="container mx-auto px-8">

          {/* Header with Category and Filters */}
          <div className="mb-5 text-center flex justify-between">
            <div className="flex text-green-700">
              <Link to="/dashboard">
                <h2 className="text-xl font-bold text-center me-3 hover:underline">
                  Dashboard
                </h2>
              </Link>{" "}
              /
              <h2 className="text-xl font-bold text-center ms-3">
                {selectedCategory} {/* Displays the currently selected category */}
              </h2>
            </div>

            {/* Search Bar and Branch Filter */}
            <div className="flex gap-2">
              <label className="input input-bordered flex items-center gap-2">

                 {/* Search Bar */}
                <input
                  type="text"
                  className="grow"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
              </label>

              {/* Branch Selector Dropdown */}
              <select
                className="select select-bordered w-full max-w-xs mb-4"
                value={selectedBranchId} // Bound to `selectedBranchId` state
                onChange={(e) => setSelectedBranchId(e.target.value)} // Update selected branch
              >
                <option value="">Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.branch_name}>
                    {branch.branch_name} {/* Display branch name */}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id} // Unique key for each product
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border bg-white"
              >
                 {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                {/* Product Name */}
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  {product.product_name}
                </h3>

                {/* Product Details */}
                <p className="text-sm text-gray-600 mb-3">
                  Net Content: {product.net_content}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Available at {product.branch_name} Branch
                </p>

                 {/* Price and Add to Cart */}
                <div className="flex justify-between">

                  {/* Product Price */}
                  <p className="text-lg font-bold text-green-700 mb-4">
                    ₱{product.product_price}
                  </p>

                   {/* Add to Cart Button */}
                  <span
                    className="text-green-700 cursor-pointer flex gap-1"
                    onClick={() => handleAddToCart(product)} //diri ko mag add product to cart
                  >
                    <MdAddShoppingCart className="mt-1" />
                    Cart
                  </span>
                </div>

                 {/* Checkout Button */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCheckoutClick(product)} // Proceed to checkout
                    className="btn btn-success text-white"
                  >
                    <TbShoppingCartCheck />
                    Check Out
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-6 mt-5">
        <div className="container mx-auto text-center font-bold">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ShopEase Mart. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isModalVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative">
            <div>
              {/* Product Details in Modal */}
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                className="w-full h-48 object-contain rounded-md mb-4"
              />
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                {selectedProduct.product_name}
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                {selectedProduct.description}
              </p>
              <p className="text-green-600 text-lg font-semibold mb-4">
                Price: ₱{selectedProduct.product_price}
              </p>

              {/* Quantity Selection */}
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity} 
                  min="1"
                  onChange={handleQuantityChange} // Update quantity
                  className="w-16 border border-gray-300 rounded-md text-center p-1"
                />
              </div>

               {/* Total Price */}
              <p>
                <strong>Total Price:</strong> ₱
                {selectedProduct.product_price * quantity}
              </p>
            </div>

             {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={handleCloseModal} // Close modal
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder} // Confirm Order
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h4>
            <p className="text-gray-600 text-sm mb-2">
              Your order has been placed successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseConfirmationModal}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Added Modal */}
      {isProductAddedModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Product Added to Cart
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              The product has been successfully added to your cart.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeCartConfirmationModal} // Close modal
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
