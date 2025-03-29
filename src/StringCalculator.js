// src/StringCalculator.js
import React, { useState } from "react";

const StringCalculator = () => {
  const [numbers, setNumbers] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    setNumbers(event.target.value);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setErrorMessage("");

  try {
    const numbersString = numbers; // If `numbers` is already a string, you can send it directly
    const queryString = new URLSearchParams({ numbers: numbersString }).toString();

    const response = await fetch(`http://localhost:3000/api/calculator/add?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

   if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setResult(data); // Store the sum from the API response in state
      } 
      else {
        const errorText = await response.text();
        if(errorText !== 0) {
          setErrorMessage(errorText);
        }
        else
        {
          setResult(0);
        }
      }
    } else {
      const errorText = await response.text();
      setErrorMessage(errorText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    setErrorMessage('Network error occurred. Please try again.');
  }
};

  return (
    <div className="container mt-5 mb-5 d-flex justify-content-center">
      <div className="card px-1 py-4">
        <div className="card-body">
          <h6 className="card-title mb-3">String Calculator</h6>
          <div className="d-flex flex-row">
            <form onSubmit={handleSubmit} id="inputForm" style={{ width: "100%" }}>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="numbers">
                      Enter numbers (comma-separated or custom delimiter):
                    </label>
                    <input
                      type="text"
                      id="numbers"
                      className="form-control"
                      value={numbers}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-primary mb-3 w-50"
                    style={{ marginTop: "4%" }}
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Display result */}
          {result !== null && !errorMessage && <h6>Result: {result}</h6>}
          {errorMessage && <h6 style={{ color: "red" }}>Error: {errorMessage}</h6>}
        </div>
      </div>
    </div>
  );
};

export default StringCalculator;
