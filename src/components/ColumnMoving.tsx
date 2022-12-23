import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import {
  ColDef,
  ColGroupDef,
  Column,
  Grid,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

export const ColumnMoving = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '80vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 150,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onMedalsFirst = useCallback(() => {
    gridRef.current!.columnApi.moveColumns(
      ['gold', 'silver', 'bronze', 'total'],
      0
    );
  }, []);

  const onMedalsLast = useCallback(() => {
    gridRef.current!.columnApi.moveColumns(
      ['gold', 'silver', 'bronze', 'total'],
      6
    );
  }, []);

  const onCountryFirst = useCallback(() => {
    gridRef.current!.columnApi.moveColumn('country', 0);
  }, []);

  const onSwapFirstTwo = useCallback(() => {
    gridRef.current!.columnApi.moveColumnByIndex(0, 1);
  }, []);

  const onPrintColumns = useCallback(() => {
    const cols = gridRef.current!.columnApi.getAllGridColumns();
    const colToNameFunc = (col: Column, index: number) =>
      index + ' = ' + col.getId();
    const colNames = cols.map(colToNameFunc).join(', ');
    console.log('columns are: ' + colNames);
  }, []);

  return (
    <div style={containerStyle} className="main-table">
      <div className="example-wrapper">
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={onMedalsFirst}>Medals First</button>
          <button onClick={onMedalsLast}>Medals Last</button>
          <button onClick={onCountryFirst}>Country First</button>
          <button onClick={onSwapFirstTwo}>Swap First Two</button>
          <button onClick={onPrintColumns}>Print Columns</button>
        </div>

        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressDragLeaveHidesColumns={true}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};