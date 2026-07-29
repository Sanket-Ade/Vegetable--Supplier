
"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from "@/context/AuthContext"

const Navbar = () => {

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [open])

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e, KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <nav className={`fixed top-0 left-0 w-full text-gray-800 rounded- sm shadow-md z-20 bg-[url('/navimage.png')] bg-cover bg-center transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-0 sm:px-3 lg:px-1">
        <div className="flex items-center p-0 m-0 justify-between h-16">
          {/* logo */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl sm: text-xl font-bold text-gray-800 ml-4 hover:text-[#1b4332] transition-colors">
              Farmer Vege
            </Link>
          </div>

          {/* menu button (mobile) */}
          <div className="flex md:hidden px-4">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1b4332] rounded-md p-1 transition-all"
            >
              <div className="space-y-1 transition-all duration-300">
                <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* desktop links */}
          <div className="hidden md:block text-[17px]">
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/" className="hover:underline font-bold hover:text-[#1b4332] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline font-bold hover:text-[#1b4332] transition-colors">About</Link>
              </li>

              {/* DYNAMIC DASHBOARD LINKS */}
              {user ? (
                <>
                  <li>
                    {/* Check role to determine text and link */}
                    <Link
                      href={user.role === 'shopkeeper' ? '/store-dashboard' : '/dashboard'}
                      className="hover:underline font-bold hover:text-[#1b4332] transition-colors"
                    >
                      {user.role === 'shopkeeper' ? 'Store Dashboard' : 'Dashboard'}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-emerald-100 bg-opacity-50 text-[#1b4332] px-3 py-2 rounded-md text-sm font-bold">
                      Hi, {user.name.split(' ')[0]}
                    </span>
                    <lord-icon
                      src="https://cdn.lordicon.com/vfiwitrm.json"
                      trigger="loop"
                      delay="1"
                      state="in-reveal"
                      className="w-10 h-10 px-3 rounded-md cursor-pointer hover:scale-110 transition-transform"
                      colors="primary:#ffffff,secondary:#fa4c20,tertiary:#ffffff,quaternary:#fa4c20,quinary:#fa4c20"
                      style={{ width: "40px", height: "40px" }}>
                    </lord-icon>
                    <button
                      onClick={logout}
                      className="text-red-400 font-bold text-md hover:underline hover:text-red-600 px-3 py-2 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/add-farmer" className="hover:underline font-bold hover:text-[#1b4332] transition-colors">Add Farmer</Link>
                  </li>
                  <li>
                    <Link href="/add-store" className="hover:underline font-bold hover:text-[#1b4332] transition-colors">Add Store</Link>
                  </li>
                  <li>
                    <Link href="/farmer-login" className="bg-[#1b4332] text-white px-8 pb-3 py-2 text-center rounded-full font-bold hover:opacity-100 hover:bg-[#2d5a45] transition-all shadow-md hover:shadow-lg">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* mobile menu overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Mobile menu panel */}
          <div className="md:hidden bg-white/95 backdrop-blur-md absolute left-0 right-0 top-16 z-40 shadow-xl animate-slideDown">
            <ul className="px-4 pt-4 pb-6 space-y-2">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-[#1b4332] transition-all font-medium"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-[#1b4332] transition-all font-medium"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      href={user.role === 'shopkeeper' ? '/store-dashboard' : '/marketplace'}
                      className="block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-[#1b4332] transition-all font-bold text-black"
                      onClick={() => setOpen(false)}
                    >
                      {user.role === 'shopkeeper' ? 'Store Dashboard' : 'Marketplace'}
                    </Link>
                  </li>
                  <li className="border-t border-gray-200 my-2 pt-2">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Logged in as <span className="font-bold text-[#1b4332]">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                      className="w-full text-left block px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-bold transition-all"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/add-farmer"
                      className="block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-[#1b4332] transition-all font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Add Farmer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/add-store"
                      className="block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-[#1b4332] transition-all font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Add Store
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/farmer-login"
                      className="block px-4 py-3 rounded-lg bg-[#1b4332] text-white text-center font-bold hover:bg-[#2d5a45] transition-all"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  )
}

export default Navbar