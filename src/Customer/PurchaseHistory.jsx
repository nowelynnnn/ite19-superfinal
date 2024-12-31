import React, { useEffect, useState } from "react";

const PurchaseHistory = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/transactions?filters[customer_name][$eq]=${userDetails.name}`
        );
        const data = await response.json();

        // Sort the data by date (newest first)
        const sortedData = data.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactionData(sortedData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <hr />
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.date}</td>
                <td>{purchase.product_name}</td>
                <td>{purchase.quantity}</td>
                <td>₱{purchase.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PurchaseHistory;
