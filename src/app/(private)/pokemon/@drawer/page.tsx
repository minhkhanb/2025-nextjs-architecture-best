'use client';

import Drawer from '@src/components/Drawer';
import { useState } from 'react';

export default function DrawerPage() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Pokémon Details</h2>
        <p>Select a Pokémon to view details here.</p>
      </div>
    </Drawer>
  );
}
