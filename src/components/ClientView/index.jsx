import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { useMemo, useState } from 'react';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

const Index = ({ data }) => {
  const [rowData, setRowData] = useState(data);

  const [colDefs, setColDefs] = useState([
    {
      field: 'name',
      rowGroup: true,
      hide: true
    },
    {
      field: 'time',
      valueGetter: params => {
        const fieldName = 'time';
        if (params.node.group) {
          const time = params.node.allLeafChildren.map(child => child.data[fieldName]);
          return time[time.length - 1];
        }
        return params.data[fieldName];
      }
    },
    {
      field: 'media',
      valueGetter: params => {
        const fieldName = 'media';
        if (params.node.group) {
          const uniqueMedias = params.node.allLeafChildren.reduce((acc, curr) => {
            if (!acc.includes(curr.data[fieldName])) {
              acc.push(curr.data[fieldName]);
            }
            return acc;
          }, []);
          return uniqueMedias.join(', ');
        }
        return params.data[fieldName];
      }
    },
    {
      field: 'input',
      valueGetter: params => {
        const fieldName = 'input';
        if (params.node.group) {
          const filteredInputs = params.node.allLeafChildren
            .map(child => child.data[fieldName])
            .filter(val => val !== null);
          return filteredInputs[filteredInputs.length - 1];
        }
        return params.data[fieldName];
      }
    },
    {
      field: 'output',
      valueGetter: params => {
        const fieldName = 'output';
        if (params.node.group) {
          const filteredOutputs = params.node.allLeafChildren
            .map(child => child.data[fieldName])
            .filter(val => val !== null);
          return filteredOutputs[filteredOutputs.length - 1];
        }
        return params.data[fieldName];
      }
    },
    {
      headerName: 'All Messages',
      cellRenderer: params => {
        if (params.node.group) {
          const chats = params.node.allLeafChildren.reduce((acc, curr) => {
            if (curr.data['input']) {
              acc.push({ type: 'input', text: curr.data['input'] });
            }
            if (curr.data['output']) {
              acc.push({ type: 'output', text: curr.data['output'] });
            }
            return acc;
          }, []);

          return (
            <ScrollArea className='h-[200px] pr-3'>
              {chats.map((chat, index) => {
                return (
                  <p
                    key={index}
                    className={`w-full max-w-[150px] truncate ${
                      chat.type === 'output' && 'ml-auto text-end'
                    }`}>
                    {chat.text}
                  </p>
                );
              })}
            </ScrollArea>
          );
        }
      },
      cellClass: 'h-auto',
      minWidth: 260
    },
    {
      field: 'stage',
      valueGetter: params => {
        if (params.node.group) {
          return params.node.allLeafChildren[0].data.stage;
        }
        return null;
      }
    }
  ]);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Name'
    };
  }, []);

  const defaultColDef = {
    flex: 1,
    autoHeight: true,
    cellClass: '[&>.ag-cell-wrapper]:h-full'
  };

  // Event handler for cell clicks
  const onCellClicked = params => {
    // Check if the clicked cell is expandable (i.e., it's in a group)
    if (params.node && params.node.group) {
      // Toggle the expansion state
      const currentlyExpanded = params.node.expanded;
      params.node.setExpanded(!currentlyExpanded);
    }
  };

  return (
    <div className='w-full h-dvh p-10 flex flex-col gap-y-5'>
      <h3 className='text-2xl font-semibold uppercase tracking-wider text-center underline'>
        Client view table
      </h3>
      <div className='ag-theme-quartz h-full'>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          pagination
          paginationPageSize={25}
          paginationPageSizeSelector={[25, 50, 75, 100]}
          onCellClicked={onCellClicked} // Attach the event handler
        />
      </div>
    </div>
  );
};

export default Index;
