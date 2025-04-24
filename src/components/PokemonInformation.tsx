'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PokemonInformation(): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Drawer
      </button>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white h-full w-80 shadow-lg p-6">
            <button
              onClick={toggleDrawer}
              className="text-red-500 font-bold mb-4"
            >
              Close
            </button>
            <div>Drawer Content</div>
          </div>
        </div>
      )}
    </>
  );
}
