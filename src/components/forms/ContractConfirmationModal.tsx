import React from 'react';

interface ContractConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  onGenerateContract: (transactionId: string) => Promise<void>;
}

export const ContractConfirmationModal: React.FC<ContractConfirmationModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  onGenerateContract
}) => {
  console.log('🔍 ContractConfirmationModal renderizado');
  console.log('📋 isOpen:', isOpen);
  console.log('📋 transactionId:', transactionId);
  
  if (!isOpen) {
    console.log('❌ Modal no está abierto, retornando null');
    return null;
  }

  console.log('✅ Modal está abierto, renderizando...');
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>Modal de Contrato - Debug</h2>
        <p>Transaction ID: {transactionId}</p>
        <p>Modal funcionando correctamente!</p>
        <button onClick={onClose} style={{marginRight: '10px'}}>Cerrar</button>
        <button 
          onClick={() => onGenerateContract(transactionId)}
          style={{backgroundColor: 'green', color: 'white'}}
        >
          Generar Contrato
        </button>
      </div>
    </div>
  );
}; 