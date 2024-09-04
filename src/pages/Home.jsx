import ClientView from '@/components/ClientView';
import StageView from '@/components/StageView';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader/index';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCSVData, setisLoadingCSVData] = useState(false);
  const [data, setData] = useState();

  const getConversations = async () => {
    try {
      setisLoadingCSVData(false);
      const res = await axios(
        'https://opensheet.elk.sh/1n_7dG95Yl2c9Y_Ao2ISkb8vdry01VQthpatTvQKjx7E/Sheet1'
      );
      const data = res?.data.map(item => ({
        name: item.Client,
        time: item.Time,
        media: item.Media,
        input: item.Input,
        output: item.Output
        // stage: item.Stage
      }));
      setData(data);
      if (data?.length !== 0) {
        const messagesByName = data?.reduce((acc, curr) => {
          const ifExist = acc.find(data => data.name == curr.name);

          if (ifExist) {
            acc = acc.map(pre => {
              if (pre.name == curr.name) {
                return { ...pre, msg: pre.msg.concat(curr.input || '', curr.output || '') };
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
      }
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
          return { ...client, stage: res[index].data.choices[0].message.content };
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isLoadingCSVData && data[0]?.stage && (
            <>
              <ClientView data={data} />
              <StageView data={data} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;
