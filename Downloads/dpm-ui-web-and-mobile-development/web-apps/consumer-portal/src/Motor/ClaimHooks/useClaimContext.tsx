import { useContext } from 'react';
import { ClaimContext } from '../../context/TrackClaimContext';



export const useClaimContext = () => {
  const context = useContext(ClaimContext);


  if (!context) {
    throw new Error('useClaimContext must be used within a ClaimProvider');
  }
  return context;
}