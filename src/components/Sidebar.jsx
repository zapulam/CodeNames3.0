import React, { useState } from "react";
import {
  PlusCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  MessageCircleQuestion,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = ({ onResetChat, onToggleCodemaster, codemasterMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleToggle = () => setIsCollapsed((prev) => !prev);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <motion.aside
      className="relative h-full bg-slate-900 border-r border-slate-700"
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-slate-700">
        <div className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={isCollapsed ? 'collapsed' : 'expanded'}
              className="text-xl font-bold overflow-hidden m-0 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isCollapsed ? 0 : 1, 
                x: isCollapsed ? -20 : 0 
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              CodeNames
            </motion.h2>
          </AnimatePresence>
        </div>
        <motion.button
          onClick={handleToggle}
          className={`p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 cursor-pointer ${
            isCollapsed ? 'w-full flex justify-center' : 'ml-auto'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={20} />
          </motion.div>
        </motion.button>
      </div>

      {/* Nav Items */}
      <ul className="mt-2 space-y-1 px-1">
        {[
          {
            icon: <PlusCircle size={20} />,
            label: "New Game",
            onClick: onResetChat,
          },
          {
            icon: codemasterMode ? <EyeOff size={20} /> : <Eye size={20} />,
            label: codemasterMode ? "Player View" : "Codemaster View",
            onClick: onToggleCodemaster,
          },
        ].map(({ icon, label, onClick }, index) => (
          <li key={index}>
            <button
              onClick={onClick}
              className={`group transition-colors duration-200 w-full p-3 rounded-lg hover:bg-slate-800 h-12 cursor-pointer ${
                isCollapsed ? 'flex justify-center items-center' : 'flex items-center'
              }`}
            >
              <div className="text-slate-400 group-hover:text-blue-400 flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isCollapsed ? 'collapsed' : 'expanded'}
                    className="block text-slate-200 group-hover:text-white truncate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isCollapsed ? 0 : 1, 
                      x: isCollapsed ? -20 : 0 
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {label}
                  </motion.span>
                </AnimatePresence>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Help Button */}
      <motion.div
        className="absolute bottom-4 left-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={togglePopup}
          className="text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <MessageCircleQuestion size={20} />
        </button>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={togglePopup}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-xl text-white w-11/12 max-w-md shadow-2xl border border-slate-600"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                How to Play CodeNames
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Objective:</strong> Find all your team’s words first.
                </p>
                <p>
                  <strong>Red Team:</strong> 9 words
                </p>
                <p>
                  <strong>Blue Team:</strong> 8 words
                </p>
                <p>
                  <strong>Neutral:</strong> 7 words
                </p>
                <p>
                  <strong>Assassin:</strong> 1 word (instant loss)
                </p>
                <p>
                  <strong>Codemaster View:</strong> Sees everything.
                </p>
                <p>
                  <strong>Player View:</strong> Sees only revealed words.
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={togglePopup}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default SideNav;
