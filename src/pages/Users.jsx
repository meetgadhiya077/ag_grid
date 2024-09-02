import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUsers } from '@/utils/fakeData';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Users = () => {
  const [breakDownData, setBreakDownData] = useState(null);

  const [rowData, setRowData] = useState(getUsers(500));

  const [colDefs, setColDefs] = useState([
    {
      field: 'name',
      cellRenderer: props => (
        <div className='flex items-center gap-x-2'>
          <Avatar>
            <AvatarImage src={props.data.profile} />
            <AvatarFallback>
              {(
                props.data.name
                  .split(' ')
                  .map(part => part[0])
                  .join('') || ''
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{props.value}</span>
        </div>
      )
    },
    { field: 'lastMessage' },
    {
      field: 'allMessages',
      flex: 2,
      cellRenderer: props => (
        <ScrollArea className='h-[200px] pr-3'>
          {props.value.map((text, index) => (
            <p key={index} className=''>
              <span className='mr-2 text-gray-600 font-medium'>{index + 1}.</span>
              {text}
            </p>
          ))}
        </ScrollArea>
      ),
      cellClass: 'h-auto'
    },
    { field: 'stage' },
    { field: 'qaScore' }
  ]);

  const defaultColDef = {
    flex: 1,
    autoHeight: true,
    cellClass: '[&>.ag-cell-wrapper]:h-full'
  };

  const [breakdownColDef, setBreakdownColDef] = useState([
    { field: 'input' },
    { field: 'output' },
    { field: 'agentVersion' },
    { field: 'qaScore' },
    { field: 'suggestedPrompt' }
  ]);

  async function getData() {
    // const res = await fetch(
    //   'https://docs.google.com/spreadsheets/d/1pxupndFajcCNXXV1jCW6UWRqK36MY4U0QZS46k74p2M/edit?usp=sharing',
    //   {
    //     method: 'get',
    //     headers: {
    //       'content-type': 'text/csv;charset=UTF-8'
    //       //in case you need authorisation
    //       //'Authorization': 'Bearer ' + [TOKEN] //or what you like
    //     }
    //   }
    // );
    // if (res.status === 200) {
    //   const data = await res.text();
    //   console.log(data);
    // } else {
    //   console.log(`Error code ${res.status}`);
    // }

    const response = await fetch('https://example.com/your-file.csv'); // Replace with your CSV URL
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    const result = await reader.read();
    const csvData = decoder.decode(result.value);

    // Parse the CSV data
    Papa.parse(csvData, {
      header: true, // Set to false if your CSV does not have headers
      skipEmptyLines: true,
      complete: result => {
        setData(result.data); // Set parsed data to state
      }
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='w-full h-dvh'>
      <div className='ag-theme-quartz p-10 h-full'>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={25}
          paginationPageSizeSelector={[25, 50, 75, 100]}
          onRowClicked={e => setBreakDownData(e.data.breakdown)}
          rowSelection='single'
        />
      </div>
      <div className='ag-theme-quartz p-10 h-full'>
        <AgGridReact
          rowData={breakDownData}
          columnDefs={breakdownColDef}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={25}
          paginationPageSizeSelector={[25, 50, 75, 100]}
        />
      </div>
    </div>
  );
};

export default Users;
