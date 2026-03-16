/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Ideas } from './pages/Ideas';
import { Exercises } from './pages/Exercises';
import { Progress } from './pages/Progress';
import { Community } from './pages/Community';
import { Resources } from './pages/Resources';
import { Mindfulness } from './pages/Mindfulness';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="progress" element={<Progress />} />
            <Route path="community" element={<Community />} />
            <Route path="resources" element={<Resources />} />
            <Route path="mindfulness" element={<Mindfulness />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
