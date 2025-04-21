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
  const [investmentAmount, setInvestmentAmount] = useState<number>(30000);
  const [investmentCountry, setInvestmentCountry] = useState<string>('spain');
  const [fundsOriginCountry, setFundsOriginCountry] = useState<string>('');
  const [investmentDuration, setInvestmentDuration] = useState<number>(5);
  const [calculationResult, setCalculationResult] = useState<InvestmentCalculationResult | null>(null);

  const countries = [
    { value: 'spain', label: 'Spain (Recommended)' },
    { value: 'portugal', label: 'Portugal' },
    { value: 'france', label: 'France' },
    { value: 'italy', label: 'Italy' },
    { value: 'croatia', label: 'Croatia' },
    { value: 'greece', label: 'Greece' },
    { value: 'other', label: 'Other' }
  ];
  
  const originCountries = [
    { value: 'spain', label: 'Spain' },
    { value: 'portugal', label: 'Portugal' },
    { value: 'france', label: 'France' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'germany', label: 'Germany' },
    { value: 'netherlands', label: 'Netherlands' },
    { value: 'belgium', label: 'Belgium' },
    { value: 'switzerland', label: 'Switzerland' },
    { value: 'usa', label: 'United States' },
    { value: 'other', label: 'Other' }
  ];

  // Розрахунок інвестиційної доходності
  useEffect(() => {
    // Базові константи для розрахунків (можна змінити на реальні значення)
    const baseRoiRates: Record<string, number> = {
      'spain': 0.18, // 18% річних
      'portugal': 0.16,
      'france': 0.15,
      'italy': 0.15,
      'croatia': 0.17,
      'greece': 0.16,
      'other': 0.14
    };
    
    // Базова ставка доходності для вибраної країни
    const baseRate = baseRoiRates[investmentCountry] || 0.14;
    
    // Коригуємо ставку на основі суми інвестиції
    let adjustedRate = baseRate;
    if (investmentAmount >= 100000) {
      adjustedRate += 0.03; // +3% для великих інвестицій
    } else if (investmentAmount >= 50000) {
      adjustedRate += 0.01; // +1% для середніх інвестицій
    }
    
    // Поправка на тривалість інвестиції
    if (investmentDuration > 3) {
      adjustedRate += 0.01 * (investmentDuration - 3); // +1% за кожен рік понад 3 роки
    }
    
    // Обмежуємо максимальну ставку
    adjustedRate = Math.min(adjustedRate, 0.25); // максимум 25%
    
    // Розраховуємо річний дохід
    const annualReturn = investmentAmount * adjustedRate;
    
    // Розраховуємо місячний дохід
    const monthlyIncome = annualReturn / 12;
    
    // Загальний дохід за весь період
    const totalReturn = annualReturn * investmentDuration;
    
    // ROI у відсотках
    const roiPercentage = adjustedRate * 100;
    
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
  }, [investmentAmount, investmentCountry, investmentDuration, onCalculate]);

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
            min="10000"
            max="200000"
            step="5000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">€10,000</span>
            <span className="text-sm font-medium">€{investmentAmount.toLocaleString()}</span>
            <span className="text-xs text-gray-500">€200,000</span>
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
                onClick={() => setInvestmentDuration(years)}
                className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                  investmentDuration === years
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {years} {years === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investment Country
          </label>
          <select
            value={investmentCountry}
            onChange={(e) => setInvestmentCountry(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funds Origin Country
          </label>
          <select
            value={fundsOriginCountry}
            onChange={(e) => setFundsOriginCountry(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Select country --</option>
            {originCountries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
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
                €{calculationResult.monthlyIncome.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Income</p>
              <p className="text-lg font-semibold text-indigo-600">
                €{calculationResult.annualReturn.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Return ({investmentDuration} years)</p>
              <p className="text-lg font-semibold text-indigo-600">
                €{calculationResult.totalReturn.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator; 