import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import { PaymentPending } from './pages/PaymentPending';
import { RaffleView } from './pages/raffle/RaffleView';
import { RaffleLayout } from './layouts/RaffleLayout';
import { PurchaseSearch } from './pages/PurchaseSearch';
import { AdminPanel } from './components/admin/AdminPanel';
import { PaymentResponse } from './pages/PaymentResponse';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RaffleLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'search',
        element: <PurchaseSearch />,
      },
      {
        path: 'admin',
        element: <AdminPanel/>,
      },
      {
        path: 'raffle/:raffleId',
        element: <RaffleView />,
      },
      {
        path: 'success',
        element: <PaymentSuccess />,
      },
      {
        path: 'failure',
        element: <PaymentFailure />,
      },
      {
        path: 'pending',
        element: <PaymentPending />,
      },
      {
        path: 'response',
        element: <PaymentResponse />,
      },
    ],
  },
]);