import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

export const ColumnPing = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '80vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.id',
      width: 80,
      pinned: 'left',
    },
    { field: 'athlete', width: 150, pinned: 'left' },
    { field: 'age', width: 90, pinned: 'left' },
    { field: 'country', width: 150 },
    { field: 'year', width: 90 },
    { field: 'date', width: 110 },
    { field: 'sport', width: 150 },
    { field: 'gold', width: 100 },
    { field: 'silver', width: 100 },
    { field: 'bronze', width: 100 },
    { field: 'total', width: 100, pinned: 'right' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const clearPinned = useCallback(() => {
    gridRef.current!.columnApi.applyColumnState({
      defaultState: { pinned: null },
    });
  }, []);

  const resetPinned = useCallback(() => {
    gridRef.current!.columnApi.applyColumnState({
      state: [
        { colId: 'rowNum', pinned: 'left' },
        { colId: 'athlete', pinned: 'left' },
        { colId: 'age', pinned: 'left' },
        { colId: 'total', pinned: 'right' },
      ],
      defaultState: { pinned: null },
    });
  }, []);

  const pinCountry = useCallback(() => {
    gridRef.current!.columnApi.applyColumnState({
      state: [{ colId: 'country', pinned: 'left' }],
      defaultState: { pinned: null },
    });
  }, []);

  const jumpToCol = useCallback(() => {
    const value = (document.getElementById('col') as HTMLInputElement).value;
    if (typeof value !== 'string' || value === '') {
      return;
    }
    const index = Number(value);
    if (typeof index !== 'number' || isNaN(index)) {
      return;
    }
    // it's actually a column the api needs, so look the column up
    const allColumns = gridRef.current!.columnApi.getColumns();
    if (allColumns) {
      const column = allColumns[index];
      if (column) {
        gridRef.current!.api.ensureColumnVisible(column);
      }
    }
  }, []);

  const jumpToRow = useCallback(() => {
    var value = (document.getElementById('row') as HTMLInputElement).value;
    const index = Number(value);
    if (typeof index === 'number' && !isNaN(index)) {
      gridRef.current!.api.ensureIndexVisible(index);
    }
  }, []);

  return (
    <div style={containerStyle}className="main-table">
      <div className="example-wrapper">
        <div className="example-header">
          <div style={{ padding: '4px' }}>
            <button onClick={clearPinned}>Clear Pinned</button>
            <button onClick={resetPinned}>
              Left = #, Athlete, Age; Right = Total
            </button>
            <button onClick={pinCountry}>Left = Country</button>
          </div>

          <div style={{ padding: '4px' }}>
            Jump to:
            <input
              placeholder="row"
              type="text"
              style={{ width: '40px' }}
              id="row"
              onInput={jumpToRow}
            />
            <input
              placeholder="col"
              type="text"
              style={{ width: '40px' }}
              id="col"
              onInput={jumpToCol}
            />
          </div>
        </div>

        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};