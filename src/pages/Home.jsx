import ClientView from '@/components/ClientView';
import StageView from '@/components/StageView';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader/index';
import Img1 from '../../sheet.png';
import { ClipLoader } from 'react-spinners';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCSVData, setisLoadingCSVData] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const getConversations = async () => {
    try {
      setisLoadingCSVData(false);
      const regex = /\/d\/(.*?)(\/|$)/;
      const match = id.match(regex);

      let spreadsheetId = '';
      if (match && match[1]) {
        spreadsheetId = match[1];
      }
      const res = await axios(`https://opensheet.elk.sh/${spreadsheetId}/${name}`);
      // console.log(res?.data, "res?.data");
      const data = res?.data.map(item => ({
        name: item.Client,
        time: item.Time,
        media: item.Media,
        input: item.Input,
        output: item.Output
        // stage: item.Stage
      }));
      setData(data);
      const messagesByName = data?.reduce((acc, curr) => {
        const ifExist = acc.find(data => data.name == curr.name);

        if (ifExist) {
          acc = acc.map(pre => {
            if (pre.name == curr.name) {
              return {
                ...pre,
                msg: pre.msg.concat(curr.input || '', curr.output || '')
              };
            }
            return pre;
          });
        } else {
          acc.push({
            name: curr.name,
            msg: ''.concat(curr.input || '', curr.output || '')
          });
        }

        return acc;
      }, []);
      getStage(messagesByName);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setisLoadingCSVData(true);
    }
  };

  const getStage = async body => {
    try {
      setIsLoading(true);
      const res = await Promise.all(
        body?.map(data =>
          axios({
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
              Authorization:
                'Bearer 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'
            },
            data: {
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a helpful assistant. And you have to give the only answer Hot or Warm as per question.'
                },
                {
                  role: 'user',
                  content: `Analyze the given question and give the answer Hot if in a question user want to buy the product else if it's a normal conversation then give me Warm as a answer. Question: ${data.msg}`
                }
              ]
            }
          })
        )
      );

      setData(prevState => {
        return prevState?.map(client => {
          const index = body?.findIndex(data => data.name === client.name);
          return {
            ...client,
            stage: res[index].data.choices[0].message.content
          };
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setisLoadingCSVData(true);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  const isValid = data.every(item => item.input !== undefined && item.output !== undefined);

  return (
    <>
      <div className='py-[40px] pl-[50px]'>
        <a
          className='text-blue-600 underline'
          href='https://docs.google.com/spreadsheets/d/1n_7dG95Yl2c9Y_Ao2ISkb8vdry01VQthpatTvQKjx7E/edit?gid=0#gid=0'
          target='_blank'
          rel='noopener noreferrer'>
          Sample sheet link
        </a>
      </div>
      <div className='flex items-center gap-[30px] pl-[50px]'>
        <div>
          Spreadsheet link:
          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder='please enter spreadsheet link'
            className='ml-[10px] w-[300px] border-gray-300 border-[1px] rounded-[7px] pl-[5px] h-[35px]'
          />
        </div>
        <div>
          Spreadsheet name:
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='please enter spreadsheet name'
            className='ml-[10px] w-[300px] border-gray-300 border-[1px] rounded-[7px] pl-[5px] h-[35px]'
          />
        </div>
        <div
          onClick={() => {
            getConversations();
          }}
          className='h-40px cursor-pointer flex items-center justify-center h-[35px] px-[10px] bg-green-500 rounded-[7px]'>
          {!isLoadingCSVData ? <ClipLoader color='#fff' size={20} /> : 'Fetch'}
        </div>
      </div>
      <>
        {isLoading || !isLoadingCSVData ? (
          <Loader />
        ) : (
          <>
            {data?.length !== 0 ? (
              <>
                {isLoadingCSVData && data?.[0]?.stage && (
                  <>
                    {isValid ? (
                      <>
                        <ClientView data={data} />
                        <StageView data={data} />
                      </>
                    ) : (
                      <div className='w-full pl-[50px] pt-[50px] text-red-600'>
                        *Sheet format invalid. Please check sample sheet for reference.
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <img
                src={Img1}
                alt='img'
                className='my-[30px] ml-[50px] border-[1px] border-gray-500'
              />
            )}
          </>
        )}
      </>
    </>
  );
};

export default Home;

// import ClientView from '@/components/ClientView';
// import StageView from '@/components/StageView';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import Loader from '@/components/common/Loader/index';

// const Home = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingCSVData, setisLoadingCSVData] = useState(false);
//   const [data, setData] = useState();

//   const getConversations = async () => {
//     try {
//       setisLoadingCSVData(false);
//       const res = await axios(
//         'https://opensheet.elk.sh/1n_7dG95Yl2c9Y_Ao2ISkb8vdry01VQthpatTvQKjx7E/Sheet1'
//       );
//       const data = res?.data.map(item => ({
//         name: item.Client,
//         time: item.Time,
//         media: item.Media,
//         input: item.Input,
//         output: item.Output,
//         // stage: item.Stage
//       }));
//       setData(data);
//       if (data?.length !== 0) {
//         const messagesByName = data?.reduce((acc, curr) => {
//           const ifExist = acc.find(data => data.name == curr.name);

//           if (ifExist) {
//             acc = acc.map(pre => {
//               if (pre.name == curr.name) {
//                 return { ...pre, msg: pre.msg.concat(curr.input || '', curr.output || '') };
//               }
//               return pre;
//             });
//           } else {
//             acc.push({
//               name: curr.name,
//               msg: ''.concat(curr.input || '', curr.output || '')
//             });
//           }

//           return acc;
//         }, []);
//         getStage(messagesByName);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//       setisLoadingCSVData(true);
//     }
//   };

//   const getStage = async body => {
//     try {
//       setIsLoading(true);
//       const res = await Promise.all(
//         body?.map(data =>
//           axios({
//             method: 'POST',
//             url: 'https://api.openai.com/v1/chat/completions',
//             headers: {
//               Authorization:
//                 'Bearer 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'
//             },
//             data: {
//               model: 'gpt-4o-mini',
//               messages: [
//                 {
//                   role: 'system',
//                   content:
//                     'You are a helpful assistant. And you have to give the only answer Hot or Warm as per question.'
//                 },
//                 {
//                   role: 'user',
//                   content: `Analyze the given question and give the answer Hot if in a question user want to buy the product else if it's a normal conversation then give me Warm as a answer. Question: ${data.msg}`
//                 }
//               ]
//             }
//           })
//         )
//       );

//       setData(prevState => {
//         return prevState?.map(client => {
//           const index = body?.findIndex(data => data.name === client.name);
//           return { ...client, stage: res[index].data.choices[0].message.content };
//         });
//       });
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//       setisLoadingCSVData(true);
//     }
//   };

//   useEffect(() => {
//     getConversations();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <>
//           <ClientView data={data} />
//           {isLoadingCSVData && data[0]?.stage && <StageView data={data} />}
//         </>
//       )}
//     </>
//   );
// };

// export default Home;
