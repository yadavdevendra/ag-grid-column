import React, { useState } from 'react';
import './App.css';
import './style.css';
import { ColumnDefinitions } from './components/ColumnDefinitions';
import { UpdatingColumnDefinitions } from './components/UpdatingColumnDefinitions';
import { RemoveGrid } from './components/RemoveGrid';
import { ColumnHeader } from './components/ColumnHeader';
import { ColumGroup } from './components/ColumGroup';
import { ColumSize } from './components/ColumSize';
import { ColumnMoving } from './components/ColumnMoving';
import { ColumnPing } from './components/ColumnPing';

function App() {
  const [open, close] = useState<boolean>(false)
  const [toggle, setToggle] = useState(true)
  return (
    <div>
      <button
        onClick={() => close(!open)}
        className="btn btn-primary mb-5">
        {(open) ? "Updating Column Definitions" : "Column Definitions"}
      </button>
      {open && (<ColumnDefinitions />)}
      {open && (<RemoveGrid />)}
      {toggle && (<UpdatingColumnDefinitions />)}
      {toggle && (<ColumnHeader />)}
      <ColumGroup />
      <ColumSize />
      <ColumnMoving />
      <ColumnPing/>
    </div>
  );
}

export default App;
