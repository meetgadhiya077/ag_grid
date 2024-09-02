import ClientView from '@/components/ClientView';
import StageView from '@/components/StageView';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader/index';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCSVData, setisLoadingCSVData] = useState(false);
  const [data, setData] = useState();
  // 'https://opensheet.elk.sh/13edLk3q0Demsu-LM2rtZH1097oA4-s2vdYclCIur70Y/Sheet1'
  console.log('data =====', data);
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
          <ClientView data={data} />
          {isLoadingCSVData && data[0]?.stage && <StageView data={data} />}
        </>
      )}
    </>
  );
};

export default Home;
