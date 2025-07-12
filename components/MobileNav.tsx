"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Floating Hamburger Button */}
      <button
        className="fixed bottom-6 right-6 z-50 md:hidden w-14 h-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-xl flex items-center justify-center focus:outline-none"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>
      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 flex items-end" onClick={() => setOpen(false)}>
          {/* Bottom Sheet Modal */}
          <div
            className="w-full rounded-t-3xl bg-[#181a20] border-t border-white/10 shadow-2xl p-6 pb-10 pb-safe animate-slide-up max-h-[80vh] overflow-y-auto hide-scrollbar"
            style={{ maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 text-lg font-semibold text-white">
              <Link href="#how-it-works" onClick={() => setOpen(false)} className="py-3 rounded-xl hover:bg-white/10 transition">How it Works</Link>
              <Link href="#pricing" onClick={() => setOpen(false)} className="py-3 rounded-xl hover:bg-white/10 transition">Pricing</Link>
              <Link href="/report" onClick={() => setOpen(false)} className="py-3 rounded-xl hover:bg-purple-400/10 focus:text-purple-400 hover:text-purple-400 transition">Demo Report</Link>
              <Link href="/blog" onClick={() => setOpen(false)} className="py-3 rounded-xl hover:bg-white/10 transition">Blog</Link>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button className="bg-white text-black w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors duration-200">
                Sign In
              </button>
              <button className="bg-white text-[#181a20] w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Create Account
              </button>
            </div>
            <button
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold text-base shadow-lg"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
} 