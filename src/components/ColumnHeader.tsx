import React, { useCallback, useMemo, useRef, useState } from 'react';
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
} from 'ag-grid-community';
import { IOlympicData } from '../interfaces';
import { data } from '../data/data';

function setIdText(id: string, value: string | number | undefined) {
  document.getElementById(id)!.innerHTML =
    value == undefined ? 'undefined' : value + '';
}

export const ColumnHeader = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '80vh', width: '80vw' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>(data)
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      floatingFilter: true,
      width: 120,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const setPivotOn = useCallback(() => {
    document.querySelector('#requiresPivot')!.className = '';
    document.querySelector('#requiresNotPivot')!.className = 'hidden';
    gridRef.current!.columnApi.setPivotMode(true);
    // setIdText('pivot', 'on');
  }, []);

  const setPivotOff = useCallback(() => {
    document.querySelector('#requiresPivot')!.className = 'hidden';
    document.querySelector('#requiresNotPivot')!.className = '';
    gridRef.current!.columnApi.setPivotMode(false);
    // setIdText('pivot', 'off');
  }, []);

  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setHeaderHeight(value);
    // setIdText('headerHeight', value);
  }, []);

  const setGroupHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGroupHeaderHeight(value);
    // setIdText('groupHeaderHeight', value);
  }, []);

  const setFloatingFiltersHeight = useCallback((value?: number) => {
    gridRef.current!.api.setFloatingFiltersHeight(value);
    setIdText('floatingFiltersHeight', value);
  }, []);

  const setPivotGroupHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setPivotGroupHeaderHeight(value);
    // setIdText('pivotGroupHeaderHeight', value);
  }, []);

  const setPivotHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setPivotHeaderHeight(value);
    // setIdText('pivotHeaderHeight', value);
  }, []);

  return (
    <div style={containerStyle} className="main-table">
      <div className="example-wrapper">
        <div className="button-bar example-header">
          <table>
            <tbody>
              <tr>
                <td>
                  pivot (<span id="pivot">off</span>)
                </td>
                <td>
                  <button onClick={setPivotOn}>on</button>
                  <button onClick={setPivotOff}>off</button>
                </td>
              </tr>
              <tr>
                <td>
                  groupHeaderHeight (
                  <span id="groupHeaderHeight">undefined</span>)
                </td>
                <td>
                  <button onClick={() => setGroupHeaderHeight(40)}>40px</button>
                  <button onClick={() => setGroupHeaderHeight(60)}>60px</button>
                  <button onClick={() => setGroupHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
                <td>
                  headerHeight (<span id="headerHeight">undefined</span>)
                </td>
                <td>
                  <button onClick={() => setHeaderHeight(70)}>70px</button>
                  <button onClick={() => setHeaderHeight(80)}>80px</button>
                  <button onClick={() => setHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
              <tr id="requiresPivot" className="hidden">
                <td>
                  pivotGroupHeaderHeight (
                  <span id="pivotGroupHeaderHeight">undefined</span>)
                </td>
                <td>
                  <button onClick={() => setPivotGroupHeaderHeight(50)}>
                    50px
                  </button>
                  <button onClick={() => setPivotGroupHeaderHeight(70)}>
                    70px
                  </button>
                  <button onClick={() => setPivotGroupHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
                <td>
                  pivotHeaderHeight (
                  <span id="pivotHeaderHeight">undefined</span>)
                </td>
                <td>
                  <button onClick={() => setPivotHeaderHeight(60)}>60px</button>
                  <button onClick={() => setPivotHeaderHeight(80)}>80px</button>
                  <button onClick={() => setPivotHeaderHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
              <tr id="requiresNotPivot">
                <td>
                  floatingFiltersHeight (
                  <span id="floatingFiltersHeight">undefined</span>)
                </td>
                <td>
                  <button onClick={() => setFloatingFiltersHeight(35)}>
                    35px
                  </button>
                  <button onClick={() => setFloatingFiltersHeight(55)}>
                    55px
                  </button>
                  <button onClick={() => setFloatingFiltersHeight(undefined)}>
                    undefined
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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