import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DressCode from '../pages/DressCode'
import Home from '../pages/Home'
import Hosts from '../pages/Hosts'
import Media from '../pages/Media'
import Performers from '../pages/Performers'
import Teaser from '../pages/Teaser'
import Venue from '../pages/Venue'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="teaser" element={<Teaser />} />
          <Route path="dress-code" element={<DressCode />} />
          <Route path="venue" element={<Venue />} />
          <Route path="hosts" element={<Hosts />} />
          <Route path="performers" element={<Performers />} />
          <Route path="media" element={<Media />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes