import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--cream)] text-[var(--dark-brown)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout