import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VoucherToast() {
  useEffect(() => {
    toast.info('💸 Use this PROMO DAEP5', {
      position: 'bottom-left',
      autoClose: false, // stays visible
      closeOnClick: true,
      draggable: false,
      closeButton: false,
      toastId: 'voucher-toast', // prevent duplicate
      style: {
        backgroundColor: '#073E46',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '12px',
        borderRadius: '10px',
        maxWidth: '300px'
      }
    });
  }, []);

  return <ToastContainer />;
}

export default VoucherToast;
