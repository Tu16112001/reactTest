import { AuthProvider } from './context/AuthContext';
import DasboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <DasboardPage></DasboardPage>
    </AuthProvider>
  );
}

export default App;
