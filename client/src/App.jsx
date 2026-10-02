import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Championship from './pages/Championship';
import Bracket from './pages/Bracket';
import Matchup from './pages/Matchup';
import TeamProfile from './pages/TeamProfile';
import Simulator from './pages/Simulator';
import Venues from './pages/Venues';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/championship" element={<Championship />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/matchup" element={<Matchup />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/teams/:slug" element={<TeamProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
