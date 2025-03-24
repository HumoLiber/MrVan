import React from 'react';
import { UserData } from '../lib/userDataService';

interface SuccessRegistrationProps {
  userData: UserData;
  onContinue: () => void;
}

const SuccessRegistration: React.FC<SuccessRegistrationProps> = ({ userData, onContinue }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Реєстрацію успішно завершено!
      </h2>
      
      <p className="text-gray-600 mb-6">
        {userData.name ? `${userData.name}, д` : 'Д'}якуємо за реєстрацію в системі Mr.Van у якості 
        {userData.role === 'investor' && ' інвестора'}
        {userData.role === 'company_owner' && ' власника компанії'}
        {userData.role === 'private_owner' && ' приватного власника'}
        {userData.role === 'agency' && ' агентства-партнера'}
        {userData.role === 'agent' && ' агента-партнера'}.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
        <h3 className="font-medium text-gray-700 mb-2">Наступні кроки:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Перевірте електронну пошту для підтвердження</li>
          <li>Дочекайтеся розгляду заявки нашою командою</li>
          <li>Підготуйте необхідні документи для верифікації</li>
        </ul>
      </div>
      
      <button
        onClick={onContinue}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300"
      >
        Продовжити
      </button>
    </div>
  );
};

export default SuccessRegistration; 