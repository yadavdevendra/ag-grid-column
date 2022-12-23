import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

declare var window: any;

export const UpdatingColumnDefinitions = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '85vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country' },
    { field: 'sport' },
    { field: 'year' },
    { field: 'date' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      width: 100,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: ['columns'],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const saveState = useCallback(() => {
    window.colState = gridRef.current!.columnApi.getColumnState();
    console.log('column state saved');
  }, []);

  const restoreState = useCallback(() => {
    if (!window.colState) {
      console.log('no columns state to restore by, you must save state first');
      return;
    }
    gridRef.current!.columnApi.applyColumnState({
      state: window.colState,
      applyOrder: true,
    });
    console.log('column state restored');
  }, []);

  const resetState = useCallback(() => {
    gridRef.current!.columnApi.resetColumnState();
    console.log('column state reset');
  }, []);

  return (
    <div style={containerStyle}className="main-table">
      <div className="test-container">
        <div className="test-header">
          <div className="example-section">
            <button onClick={saveState}>Save State</button>
            <button onClick={restoreState}>Restore State</button>
            <button onClick={resetState}>Reset State</button>
          </div>
        </div>

        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            // sideBar={sideBar}
            rowGroupPanelShow={'always'}
            pivotPanelShow={'always'}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};