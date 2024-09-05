import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

const index = ({ data }) => {
  const [stageviewRowData, setStageviewRowData] = useState(
    data?.map(clients => {
      const staticData = [
        { name: 'James', stage: 'Hot', qa_score: 5 },
        { name: 'David', stage: 'Warm', qa_score: 4 },
        { name: 'Larry', stage: 'Hot', qa_score: 1 },
        { name: 'Jetlee', stage: 'Warm', qa_score: 3 }
      ];
      const { stage, qa_score } = data.find(data => data.name === clients.name);
      return { ...clients, stage, qa_score };
    })
  );

  const [stageviewColDefs, setStageviewColDefs] = useState([
    {
      field: 'stage',
      headerName: 'Stage view',
      rowGroup: true,
      hide: true
    },
    {
      field: 'name',
      headerName: 'Name',
      rowGroup: true,
      hide: true
    },
    {
      field: 'time',
      valueGetter: params => {
        if (params.node.rowGroupIndex === 0) return null;
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
        if (params.node.rowGroupIndex === 0) return null;
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
        if (params.node.rowGroupIndex === 0) return null;
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
        if (params.node.rowGroupIndex === 0) return null;
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
        if (params.node.rowGroupIndex === 0) return null;
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
      headerName: 'Clients',
      valueGetter: params => {
        if (params.node.rowGroupIndex === 0) {
          return params.node.childrenAfterGroup.length;
        }
        return null;
      }
    }
  ]);

  const defaultColDef = {
    flex: 1,
    autoHeight: true,
    cellClass: '[&>.ag-cell-wrapper]:h-full cursor-pointer'
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
        Stage view table
      </h3>
      <div className='ag-theme-quartz h-full'>
        <AgGridReact
          rowData={stageviewRowData}
          columnDefs={stageviewColDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={25}
          paginationPageSizeSelector={[25, 50, 75, 100]}
          groupDisplayType='multipleColumns'
          onCellClicked={onCellClicked}
        />
      </div>
    </div>
  );
};

export default index;
