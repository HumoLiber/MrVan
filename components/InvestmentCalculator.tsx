import { useState, useEffect } from 'react';

interface InvestmentCalculatorProps {
  onCalculate?: (calculationResults: InvestmentCalculationResult) => void;
}

export interface InvestmentCalculationResult {
  investmentAmount: number;
  annualReturn: number;
  monthlyIncome: number;
  totalReturn: number;
  roiPercentage: number;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ onCalculate }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(15000);
  const [investmentDuration, setInvestmentDuration] = useState<number>(5);
  const [calculationResult, setCalculationResult] = useState<InvestmentCalculationResult | null>(null);

  // Розрахунок інвестиційної доходності
  useEffect(() => {
    // Fixed annual return rate of 10%
    const baseRate = 0.10; // 10% річних
    
    // Calculate annual return
    const annualReturn = investmentAmount * baseRate;
    
    // Calculate monthly income
    const monthlyIncome = annualReturn / 12;
    
    // Total return over the investment period
    const totalReturn = annualReturn * investmentDuration;
    
    // ROI percentage
    const roiPercentage = baseRate * 100;
    
    const result: InvestmentCalculationResult = {
      investmentAmount,
      annualReturn,
      monthlyIncome,
      totalReturn,
      roiPercentage
    };
    
    setCalculationResult(result);
    
    if (onCalculate) {
      onCalculate(result);
    }
  }, [investmentAmount, investmentDuration, onCalculate]);

  // Format numbers with European style thousand separators (using space)
  const formatEuro = (value: number) => {
    return '€' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">💰 Investment Calculator</h3>
      <p className="text-gray-600 mb-6">
        Calculate the potential return on your campervan investment based on your preferences.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount (€)
          </label>
          <input
            type="range"
            min="15000"
            max="200000"
            step="5000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">€15 000</span>
            <span className="text-sm font-medium">{formatEuro(investmentAmount)}</span>
            <span className="text-xs text-gray-500">€200 000</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investment Duration (Years)
          </label>
          <div className="flex space-x-2">
            {[1, 3, 5, 10].map((years) => (
              <button
                key={years}
                type="button"
                onClick={() => setInvestmentDuration(years)}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                  investmentDuration === years
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {years} {years === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {calculationResult && (
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold text-lg text-indigo-700 mb-3">Your Investment Projection</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Expected Annual Return</p>
              <p className="text-2xl font-bold text-indigo-600">
                {calculationResult.roiPercentage.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatEuro(calculationResult.monthlyIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Income</p>
              <p className="text-lg font-semibold text-indigo-600">
                {formatEuro(calculationResult.annualReturn)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Return ({investmentDuration} years)</p>
              <p className="text-lg font-semibold text-indigo-600">
                {formatEuro(calculationResult.totalReturn)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;