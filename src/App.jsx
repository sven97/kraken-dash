import useMonitoring from './hooks/useMonitoring';
import Dashboard from './components/Dashboard';

// CAM appends ?kraken=1 to the integration URL; we render the dashboard either way.
// Simulation auto-engages when window.nzxt is absent (desktop / GitHub Pages preview).
function App() {
  const data = useMonitoring();
  return <Dashboard data={data} />;
}

export default App;
