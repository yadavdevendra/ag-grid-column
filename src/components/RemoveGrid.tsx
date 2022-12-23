import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './styles.css';
import { ColDef, GridReadyEvent, } from 'ag-grid-community';
import { IOlympicData } from '../interfaces';

function getColumnDefs() {
    return [
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
    ];
}

export const RemoveGrid = () => {
    const gridRef = useRef<AgGridReact<IOlympicData>>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '80vh', width: '75vw' }), []);
    const [rowData, setRowData] = useState<IOlympicData[]>();
    //   const defaultColDef = useMemo<ColDef>(() => {
    //     return {
    //       initialWidth: 100,
    //       sortable: true,
    //       resizable: true,
    //       filter: true,
    //     };
    //   }, []);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(getColumnDefs());

    const onGridReady = useCallback((params: GridReadyEvent) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data: IOlympicData[]) => {
                setRowData(data);
            });
    }, []);

    const setHeaderNames = useCallback(() => {
        const columnDefs: ColDef[] = getColumnDefs();
        columnDefs.forEach(function (colDef, index) {
            colDef.headerName = 'C' + index;
        });
        gridRef.current!.api.setColumnDefs(columnDefs);
    }, []);

    const removeHeaderNames = useCallback(() => {
        const columnDefs: ColDef[] = getColumnDefs();
        columnDefs.forEach(function (colDef, index) {
            colDef.headerName = undefined;
        });
        gridRef.current!.api.setColumnDefs(columnDefs);
    }, []);

    const setValueFormatters = useCallback(() => {
        const columnDefs: ColDef[] = getColumnDefs();
        columnDefs.forEach(function (colDef, index) {
            colDef.valueFormatter = function (params) {
                return '[ ' + params.value + ' ]';
            };
        });
        gridRef.current!.api.setColumnDefs(columnDefs);
    }, []);

    const removeValueFormatters = useCallback(() => {
        const columnDefs: ColDef[] = getColumnDefs();
        columnDefs.forEach(function (colDef, index) {
            colDef.valueFormatter = undefined;
        });
        gridRef.current!.api.setColumnDefs(columnDefs);
    }, []);

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
    return (
        <div style={containerStyle} className="main-table">
           
            <div className="test-container">
                <div className="test-header">
                    <button onClick={setHeaderNames}>Set Header Names</button>
                    <button onClick={removeHeaderNames}>Remove Header Names</button>
                    <button onClick={setValueFormatters}>Set Value Formatters</button>
                    <button onClick={removeValueFormatters}>
                        Remove Value Formatters
                    </button>
                </div>

                <div style={gridStyle} className="ag-the ColGroupDef,
  Grid,
  GridOptions,me-alpine">
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