import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ColGroupDef, Grid, GridOptions } from 'ag-grid-community';
import { getData } from '../data/data';

export const ColumnDefinitions = () => {
    const [open, close] = useState<boolean>(false)
    const containerStyle = useMemo(() => ({ width: '100vw', height: '100vh', }), []);
    const gridStyle = useMemo(() => ({ height: '80vh', width: '50vw',}), []);
    const [rowData, setRowData] = useState<any[]>(getData());
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'name' },
        // Using dot notation to access nested property
        { field: 'medals.gold', headerName: 'Gold' },
        // Show default header name
        { field: 'person.age' },
    ]);

    return (
        <div style={containerStyle}className="main-table">
            <div style={{ height: '80%', boxSizing: 'border-box' }}>
                <div style={gridStyle} className="ag-theme-alpine">
                <h1>React Data Grid: Column Definitions</h1>
                    <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
                </div>
            </div>
        </div>
    );
};