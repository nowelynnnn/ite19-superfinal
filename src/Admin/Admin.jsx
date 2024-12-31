import React, { useState, useEffect } from "react";
import { HiUserCircle } from "react-icons/hi2";

const Admin = () => {
  const [transactionsData, setTransactionsData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactionsData(data.data || []); 
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactionsData([]);
      }
    };

    fetchTransactions();
    console.log(totalSalesByBranch);
  }, []);

  const filteredTransactions = transactionsData.filter((transaction) => {
    const matchesSearch = transaction.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBranch =
      selectedBranch === "All" || transaction.branch_name === selectedBranch;
    return matchesSearch && matchesBranch;
  });


  const totalSalesByBranch = transactionsData.reduce((acc, transaction) => {
    const total = parseFloat(transaction.total); 
    if (!isNaN(total)) {
      acc[transaction.branch_name] = acc[transaction.branch_name]
        ? acc[transaction.branch_name] + total
        : total;
    }
    return acc;
  }, {});
  
  const sortedBranches = Object.entries(totalSalesByBranch).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      <div className="navbar bg-green-500 px-5">
        <div className="flex-1">
          <img className="h-14 w-14" src="login.png" alt="logo" />
          <p className="text-xl text-white font-bold">ShopEase Mart</p>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end font-bold">
            <div
              tabIndex={0}
              role="button"
              className="flex text-white underline gap-1"
            >
              <HiUserCircle size={26} />
              <p className="text-md">Admin</p>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="mt-2">
                <a href="/" className="text-gray-600">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-base-200 min-h-screen space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold text-green-800">Sales Dashboard</h1>
          <div className="mt-4 md:mt-0 flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-success w-full md:w-60"
            />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="select select-bordered select-success w-full md:w-auto"
            >
              <option value="All">All Branches</option>
              {Array.from(new Set(transactionsData.map((t) => t.branch_name))).map(
                (branch_name) => (
                  <option key={branch_name} value={branch_name}>
                    {branch_name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white shadow-xl rounded-lg p-5">
            <div className="p-4 border-b bg-base-100">
              <h2 className="text-lg font-semibold text-success">
                Transaction History
              </h2>
            </div>
            <div className="overflow-x-auto" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Branch</th>
                    <th>Product</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.date}</td>
                        <td>{transaction.branch_name}</td>
                        <td>{transaction.product_name}</td>
                        <td>${transaction.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


          <div className="bg-white shadow-xl rounded-lg">
            <div className="p-4 border-b bg-base-100">
              <h2 className="text-lg font-semibold text-success">
                Total Sales by Branch
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {sortedBranches.map(([branch, total], index) => (
                <div
                  key={branch}
                  className="card bg-base-100 border border-gray-200 shadow-sm"
                >
                  <div className="card-body">
                    <h3 className="card-title text-black">
                      {index + 1}. {branch}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Total Sales: ${total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-base-300 py-6 mt-3">
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

export default Admin;
