import React from "react";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

const purchases = [
  {
    id: 1,
    date: "2024-12-01",
    productName: "Product 1",
    quantity: 2,
    price: 29.99,
    total: 59.98,
  },
  {
    id: 2,
    date: "2024-12-05",
    productName: "Product 2",
    quantity: 1,
    price: 19.99,
    total: 19.99,
  },
  {
    id: 3,
    date: "2024-12-10",
    productName: "Product 3",
    quantity: 1,
    price: 39.99,
    total: 39.99,
  },
];

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
          console.log(data.data)
          setTransactionData(data.data)
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        } finally {;
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
