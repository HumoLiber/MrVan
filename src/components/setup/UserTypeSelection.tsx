import React from 'react';
import './UserTypeSelection.css';

export type UserType = 'private' | 'company';
export type DelegationMode = 'service_only' | 'partial_help' | 'full_delegation';

interface UserTypeSelectionProps {
  onUserTypeSelect: (userType: UserType, delegationMode?: DelegationMode) => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onUserTypeSelect }) => {
  const [selectedType, setSelectedType] = React.useState<UserType | null>(null);
  const [delegationMode, setDelegationMode] = React.useState<DelegationMode | null>(null);

  const handleContinue = () => {
    if (selectedType === 'private') {
      // For private users, always use full delegation
      onUserTypeSelect(selectedType, 'full_delegation');
    } else if (selectedType === 'company' && delegationMode) {
      onUserTypeSelect(selectedType, delegationMode);
    }
  };

  return (
    <div className="user-type-selection">
      <h2>Хто ви?</h2>
      <p>Виберіть тип користувача, щоб продовжити</p>
      
      <div className="user-type-options">
        <div 
          className={`user-type-card ${selectedType === 'private' ? 'selected' : ''}`}
          onClick={() => setSelectedType('private')}
        >
          <div className="user-type-icon">👤</div>
          <h3>Приватна особа</h3>
          <p>Я фізична особа, яка хоче зареєструвати свій кемпер</p>
          {selectedType === 'private' && (
            <div className="delegation-info">
              <p><strong>Режим делегування:</strong> Повне делегування</p>
              <p className="delegation-description">
                Ми повністю керуємо вашим кемпером у системі MrVan
              </p>
            </div>
          )}
        </div>
        
        <div 
          className={`user-type-card ${selectedType === 'company' ? 'selected' : ''}`}
          onClick={() => setSelectedType('company')}
        >
          <div className="user-type-icon">🏢</div>
          <h3>Компанія</h3>
          <p>Ми представляємо компанію з кількома кемперами</p>
          
          {selectedType === 'company' && (
            <div className="delegation-options">
              <h4>Виберіть режим співпраці:</h4>
              
              <div 
                className={`delegation-option ${delegationMode === 'service_only' ? 'selected' : ''}`}
                onClick={() => setDelegationMode('service_only')}
              >
                <h5>Тільки сервіс</h5>
                <p>Ви самостійно керуєте кемперами, ми надаємо сервісні послуги</p>
              </div>
              
              <div 
                className={`delegation-option ${delegationMode === 'partial_help' ? 'selected' : ''}`}
                onClick={() => setDelegationMode('partial_help')}
              >
                <h5>Часткова допомога</h5>
                <p>Ми допомагаємо з деякими аспектами управління вашими кемперами</p>
              </div>
              
              <div 
                className={`delegation-option ${delegationMode === 'full_delegation' ? 'selected' : ''}`}
                onClick={() => setDelegationMode('full_delegation')}
              >
                <h5>Повне делегування</h5>
                <p>Ми повністю керуємо вашими кемперами у системі MrVan</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="user-type-actions">
        <button 
          className="button-primary"
          disabled={!selectedType || (selectedType === 'company' && !delegationMode)}
          onClick={handleContinue}
        >
          Продовжити
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;
