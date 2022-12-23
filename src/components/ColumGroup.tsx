import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import {ColDef,GridReadyEvent} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

function createNormalColDefs() {
  return [
    {
      headerName: 'Athlete Details',
      headerClass: 'participant-group',
      children: [
        { field: 'athlete', colId: 'athlete' },
        { field: 'country', colId: 'country' },
      ],
    },
    { field: 'age', colId: 'age' },
    {
      headerName: 'Sports Results',
      headerClass: 'medals-group',
      children: [
        { field: 'sport', colId: 'sport' },
        { field: 'gold', colId: 'gold' },
      ],
    },
  ];
}

function createExtraColDefs() {
  return [
    {
      headerName: 'Athlete Details',
      headerClass: 'participant-group',
      children: [
        { field: 'athlete', colId: 'athlete' },
        { field: 'country', colId: 'country' },
        { field: 'region1', colId: 'region1' },
        { field: 'region2', colId: 'region2' },
      ],
    },
    { field: 'age', colId: 'age' },
    { field: 'distance', colId: 'distance' },
    {
      headerName: 'Sports Results',
      headerClass: 'medals-group',
      children: [
        { field: 'sport', colId: 'sport' },
        { field: 'gold', colId: 'gold' },
      ],
    },
  ];
}

export const  ColumGroup= () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '80vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      resizable: true,
      width: 150,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(createNormalColDefs());

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const onBtNormalCols = useCallback(() => {
    gridRef.current!.api.setColumnDefs(createNormalColDefs());
  }, []);

  const onBtExtraCols = useCallback(() => {
    gridRef.current!.api.setColumnDefs(createExtraColDefs());
  }, []);

  return (
    <div style={containerStyle}className="main-table">
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtNormalCols}>Normal Cols</button>
          <button onClick={onBtExtraCols}>Extra Cols</button>
        </div>

        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};