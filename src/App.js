import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [annualAmount, setAnnualAmount] = useState(10000);
  const [pledgePeriod, setPledgePeriod] = useState(5);
  const [roiPercentage, setRoiPercentage] = useState(7);
  const [displayGrowth, setDisplayGrowth] = useState(5);
  const [fullResult, setFullResult] = useState([]);
  const [showResult, setShowResult] = useState(false); //for conditional rendering

  const disembursementFee = 4; //fixed
  const adminFee = 2; //fixed
  const today = new Date();
  const currentYear = today.getFullYear();

  let displayPledgeAmount = (annualAmount * pledgePeriod).toLocaleString(undefined, {maximumFractionDigits:0});
  let displayAnnualAmount = annualAmount.toLocaleString(undefined, {maximumFractionDigits:0});


  useEffect(() => {
    calculateEndowment();
  }, [annualAmount, pledgePeriod, roiPercentage, displayGrowth])

  const calculateEndowment = () => {
    let balance = 0;
    let results = [];

    for (let year = 1; year <= displayGrowth; year++) {
      if (year === 1) {
        results.push({
          year,
          balance: annualAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}),
          donationImpact: 0.00.toFixed(2)
        })
        
        balance += annualAmount
        continue
      }

      let generatedIncome = balance * roiPercentage / 100;
      let calculatedDisembursement = balance * disembursementFee / 100;
      let calculatedAdminFee = balance * adminFee / 100;

      let yearBalance = generatedIncome - (calculatedDisembursement + calculatedAdminFee);
      balance += yearBalance;

      if (year <= pledgePeriod) {
        balance += annualAmount;
      }
      
      results.push({
        year,
        balance: balance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}),
        donationImpact: calculatedDisembursement.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})
      })
    }

    setFullResult(results);
  }

  return (
    <div className="App">
      <h1>Endowment Calculator</h1>
      <div className="endowment-form">
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
          <button onClick={(e) => setRoiPercentage(Number(roiPercentage) - 1)} hidden>-</button>
          <input
            type="text"
            value={roiPercentage + "%"}
            onChange={(e) => setRoiPercentage(e.target.value.replace(/[^\.0-9]/g, ''))}
            required
            disabled
          />
          <button onClick={(e) => setRoiPercentage(Number(roiPercentage) + 1)} hidden>+</button>
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

        {!showResult && <button className='calculate-button' onClick={() => setShowResult(true)}>Calculate</button>}
      </div>

      {showResult && (
        <div>
          <div className="calculation-report">
            <h2>Endowment Calculation Report:</h2>
            <p>Endowing a donation of ${displayPledgeAmount} over a {pledgePeriod} year period can be seen in the illustration below.</p>
            <ul>
              <li>The ${displayPledgeAmount} commitment is made up of {pledgePeriod} payment(s) of ${displayAnnualAmount}.</li>
              <li>Your donation will be invested at a rate of approximately {roiPercentage}%.</li>
              <li>From the {roiPercentage}% of income generation, approximately {disembursementFee}% will be directed to 
                your program of support. The endowment calculator shows the continued impact of the donation.</li>
              <li>An annual administration fee of {adminFee}% will be deducted from the {roiPercentage}% approximate income. 
                The remainder from the {roiPercentage}% approximate income generated will be added to the capital of your fund.</li>
            </ul>
          </div>
          <div className="result-table">
            <h3>5 Year Growth</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Impact of Donation</th>
                </tr>
              </thead>
              <tbody>
                {fullResult.map((result) => (
                  <>
                  {result.year < 6 &&
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>${result.balance}</td>
                    <td>${result.donationImpact}</td>
                  </tr>
                  }
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {displayGrowth >= 10 &&
          <div className="result-table">
            <h3>10 Year Growth</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Impact of Donation</th>
                </tr>
              </thead>
              <tbody>
                {fullResult.map((result) => (
                  <>
                  {result.year > 5 && result.year < 11 &&
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>${result.balance}</td>
                    <td>${result.donationImpact}</td>
                  </tr>
                  }
                  </>
                ))}
              </tbody>
            </table>
          </div>
          }

          {displayGrowth >= 15 &&
          <div className="result-table">
            <h3>15 Year Growth</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Impact of Donation</th>
                </tr>
              </thead>
              <tbody>
                {fullResult.map((result) => (
                  <>
                  {result.year > 10 && result.year < 16 &&
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>${result.balance}</td>
                    <td>${result.donationImpact}</td>
                  </tr>
                  }
                  </>
                ))}
              </tbody>
            </table>
          </div>
          }
          {displayGrowth >= 20 &&
          <div className="result-table">
            <h3>20 Year Growth</h3>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Impact of Donation</th>
                </tr>
              </thead>
              <tbody>
                {fullResult.map((result) => (
                  <>
                  {result.year > 15 && result.year < 21 &&
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>${result.balance}</td>
                    <td>${result.donationImpact}</td>
                  </tr>
                  }
                  </>
                ))}
              </tbody>
            </table>
          </div>
          }

        {displayGrowth >= 25 &&
        <div className="result-table">
          <h3>25 Year Growth</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Balance</th>
                <th>Impact of Donation</th>
              </tr>
            </thead>
            <tbody>
              {fullResult.map((result) => (
                <>
                {result.year > 20 && result.year <= 25 &&
                <tr key={result.year}>
                  <td>{result.year}</td>
                  <td>${result.balance}</td>
                  <td>${result.donationImpact}</td>
                </tr>
                }
                </>
              ))}
            </tbody>
          </table>
        </div>
        }
        </div>
      )}
    </div>
  );
}

export default App;
