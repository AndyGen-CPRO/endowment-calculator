import React, { useState, useEffect, use } from 'react'

function App() {
  const [annualAmount, setAnnualAmount] = useState(10000);
  const [pledgePeriod, setPledgePeriod] = useState(5);
  const [roiPercentage, setRoiPercentage] = useState(6);
  const [displayGrowth, setDisplayGrowth] = useState(5);
  const [fullResult, setFullResult] = useState([]);
  const [showResult, setShowResult] = useState(false); //for conditional rendering

  const disembursementFee = 4; //fixed
  const adminFee = 2; //fixed
  const today = new Date();
  const currentYear = today.getFullYear();

  useEffect(() => {
    calculateEndowment();
  }, [annualAmount, pledgePeriod, roiPercentage, displayGrowth])

  const calculateEndowment = () => {
    let balance = 0;
    let results = [];

    for (let year = 1; year <= displayGrowth; year++) {
      if (year <= pledgePeriod) {
        balance += annualAmount;
      }

      let generatedIncome = balance * roiPercentage / 100;
      let calculatedDisembursement = balance * disembursementFee / 100;
      let calculatedAdminFee = balance * adminFee / 100;

      let yearBalance = generatedIncome - (calculatedDisembursement + calculatedAdminFee);
      balance += yearBalance;
      
      results.push({
        year,
        balance: balance.toFixed(2),
      })
    }

    setFullResult(results);
  }

  return (
    <div>
      <h1>Endowment Calculator</h1>
      <div>
        <label>Annual Donation Amount:</label>
        <button onClick={(e) => setAnnualAmount(annualAmount - 5000)}>-</button>
        <input
          type="text"
          value={"$" + annualAmount + "CDN"}
          onChange={(e) => setAnnualAmount(Number(e.target.value.replace(/\D/g, "")))}
          required
        />
        <button onClick={(e) => setAnnualAmount(annualAmount + 5000)}>+</button>
      </div>

      <div>
        <label>Pledge Period:</label>
        <select
          value={pledgePeriod}
          onChange={(e) => setPledgePeriod(e.target.value)}
          required
        >
          <option value={1} selected>1 Year</option>
          <option value={2}>2 Years</option>
          <option value={3}>3 Years</option>
          <option value={4}>4 Years</option>
          <option value={5}>5 Years</option>
          <option value={6}>6 Years</option>
          <option value={7}>7 Years</option>
          <option value={8}>8 Years</option>
          <option value={9}>9 Years</option>
          <option value={10}>10 Years</option>
        </select>
      </div>

      <div>
        <label>ROI Percentage (%):</label>
        <button onClick={(e) => setRoiPercentage(roiPercentage - 1)}>-</button>
        <input
          type="text"
          value={roiPercentage + "%"}
          onChange={(e) => setRoiPercentage(Number(e.target.value.replace(/\D/g, "")))}
          required
        />
        <button onClick={(e) => setRoiPercentage(roiPercentage + 1)}>+</button>
      </div>

      <div>
        <label>Fixed Disembursement Amount (%):</label>
        <input
          type="text"
          value={disembursementFee + "%"}
          disabled
        />
      </div>

      <div>
        <label>Fixed Administration Fee (%):</label>
        <input
          type="text"
          value={adminFee + "%"}
          disabled
        />
      </div>

      <div>
        <label>Display Growth Over:</label>
        <select
          value={displayGrowth}
          onChange={(e) => setDisplayGrowth(e.target.value)}
          required
        >
          <option value={5} selected>5 Years</option>
          <option value={10}>10 Years</option>
          <option value={15}>15 Years</option>
          <option value={20}>20 Years</option>
          <option value={25}>25 Years</option>
        </select>
      </div>

      <button onClick={() => setShowResult(true)}>Calculate</button>

      {showResult && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {fullResult.map((result) => (
                <tr key={result.year}>
                  <td>{result.year}</td>
                  <td>{result.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
