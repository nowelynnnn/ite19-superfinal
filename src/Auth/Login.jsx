import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("customers");
  const navigate = useNavigate();

  const [signupName, setSignupName] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoadingSignIn(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:1337/api/${role}?filters[email][$eq]=${email}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      if (data.data.length === 0) {
        setError("Wrong Credentials");
        alert("wrong credentials");
        setLoadingSignIn(false);
        return;
      }

      const user = data.data[0];
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(user));

      if (role === "admins") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      setLoadingSignIn(false);
    } catch (err) {
      setError(err.message || "An error occurred while logging in.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoadingSignUp(true);
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formData = new FormData();
    const jsonData = {
      data: {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        address: signupAddress,
      },
    };
    const jsonString = JSON.stringify(jsonData);
    try {
      const response = await fetch(`http://localhost:1337/api/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });
      if (response.ok) {
        const data = await response.json();
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSignupAddress("");
        setTimeout(() => {
          setLoadingSignUp(false);
          document.getElementById("registration_modal").close();
          alert("Sign up successful!");
        }, 2000);
      } else {
        const errorData = await response.text();
        alert("Registration failed!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering!");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-green-400">
        <div className="card w-full max-w-4xl bg-base-100 shadow-xl flex flex-col lg:flex-row border p-3">
          <div className="w-full lg:w-1/2 p-8 border-r-2">
            <div className="flex gap-2 mb-3 justify-center">
              <img className="h-14 w-14" src="login.png" alt="logo" />
              <h1 className="text-4xl font-bold text-green-600 mt-2">
                ShopEase Mart
              </h1>
            </div>
            <p className="mb-6 text-gray-600 flex justify-center">
              Shop to your Comfort and Convenience
            </p>
            <form onSubmit={handleSignIn}>
              <div className="form-control mb-2">
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-control mb-4">
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="grow"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="showPassword"
                    className="mr-2"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label htmlFor="showPassword" className="text-sm">
                    Show Password
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered w-1/2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customers">Customer</option>
                  <option value="admins">Admin</option>
                </select>
                <button
                  type="submit"
                  className="btn btn-success text-white w-2/3 flex items-center justify-center"
                  disabled={loadingSignIn}
                >
                  {loadingSignIn ? (
                    <span className="flex items-center gap-2">
                      <span className="loading-spinner border-t-transparent border-white animate-spin border-2 border-solid h-4 w-4 rounded-full"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-6">
              <p className="text-sm">
                Don't have an account? &nbsp;
                <span
                  className="underline text-green-500 cursor-pointer"
                  onClick={() =>
                    document.getElementById("registration_modal").showModal()
                  }
                >
                  Create here
                </span>
              </p>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: "url('img.png')",
            }}
          >
            <div className="h-full"></div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <dialog id="registration_modal" className="modal">
        <div className="modal-box w-11/12 max-w-md p-8">
          <form method="dialog" onSubmit={handleSignUp}>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="button"
              onClick={() =>
                document.getElementById("registration_modal").close()
              }
            >
              ✕
            </button>
            <h3 className="font-bold text-2xl mb-4 text-green-700">
              | Create an account
            </h3>
            <div className="form-control mb-2">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </label>
            </div>

            <div className="form-control mb-2">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 0C5.243 0 3 2.243 3 5c0 2.062 2.175 5.024 4.202 7.329a.5.5 0 0 0 .796 0C9.825 10.024 12 7.062 12 5c0-2.757-2.243-5-4-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>

                <input
                  type="text"
                  className="grow"
                  placeholder="Address"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                />
              </label>
            </div>

            <div className="form-control mb-2">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="form-control mb-2">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="form-control mb-5">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <select
                className="select select-bordered w-1/2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customers">Customer</option>
                <option value="admins">Admin</option>
              </select>
              <button
                type="submit"
                className="btn btn-success text-white w-2/3 flex items-center justify-center"
                disabled={loadingSignUp}
              >
                {loadingSignUp ? (
                  <span className="flex items-center gap-2">
                    <span className="loading-spinner border-t-transparent border-white animate-spin border-2 border-solid h-4 w-4 rounded-full"></span>
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Login;
