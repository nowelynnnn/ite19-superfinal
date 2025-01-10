import React, { useEffect, useState } from "react";

const PurchaseHistory = () => {
  // Retrieve user details from session storage
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  // State to store the fetched transaction data
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transaction data filtered by the current user's name
        const response = await fetch(
          `http://localhost:1337/api/transactions?filters[customer_name][$eq]=${userDetails.name}`
        );
        const data = await response.json();

        // Sort the data by date (newest first)
        const sortedData = data.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Update the state with sorted transaction data
        setTransactionData(sortedData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    // Call the fetch function
    fetchData();
  }, []); // Empty dependency array ensures the fetch happens only once

  return (
    <>
      <div className="container mx-auto">
        {/* Horizontal separator */}
        <hr />

        {/* Table to display purchase history */}
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {/* Table headers */}
              <th>Date</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through transaction data and display each purchase */}
            {transactionData.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.date}</td> {/* Transaction date */}
                <td>{purchase.product_name}</td> {/* Product name */}
                <td>{purchase.quantity}</td>
                <td>₱{purchase.total}</td>
                <td>{purchase.payment_mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PurchaseHistory;
