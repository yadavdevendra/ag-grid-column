import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import {
  ColDef,
  ColGroupDef,
  ColumnResizedEvent,
  Grid,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

export const ColumSize = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '80vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'athlete', width: 150, suppressSizeToFit: true },
    {
      field: 'age',
      headerName: 'Age of Athlete',
      width: 90,
      minWidth: 50,
      maxWidth: 150,
    },
    { field: 'country', width: 120 },
    { field: 'year', width: 90 },
    { field: 'date', width: 110 },
    { field: 'sport', width: 110 },
    { field: 'gold', width: 100 },
    { field: 'silver', width: 100 },
    { field: 'bronze', width: 100 },
    { field: 'total', width: 100 },
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

  const onColumnResized = useCallback((params: ColumnResizedEvent) => {
    console.log(params);
  }, []);

  const sizeToFit = useCallback(() => {
    gridRef.current!.api.sizeColumnsToFit();
  }, []);

  const autoSizeAll = useCallback((skipHeader: boolean) => {
    const allColumnIds: string[] = [];
    gridRef.current!.columnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridRef.current!.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }, []);

  return (
    <div style={containerStyle}className="main-table">
      <div className="outer-div">
        <div className="button-bar">
          <button onClick={sizeToFit}>Size to Fit</button>
          <button onClick={() => autoSizeAll(false)}>Auto-Size All</button>
          <button onClick={() => autoSizeAll(true)}>
            Auto-Size All (Skip Header)
          </button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact<IOlympicData>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onColumnResized={onColumnResized}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};