import { faker } from '@faker-js/faker';

export const getUsers = (lenght = 10) => {
  return [...new Array(lenght)].map(() => {
    const messagesHistory = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () =>
      faker.lorem.sentence()
    );

    const breakdownData = Array.from({ length: faker.number.int({ min: 25, max: 100 }) }, () => ({
      input: faker.lorem.sentence(),
      output: faker.lorem.sentence(),
      agentVersion: `v${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({
        min: 0,
        max: 9
      })}`,
      qaScore: faker.number.int({ min: 1, max: 100 }),
      suggestedPrompt: faker.lorem.sentence()
    }));

    return {
      id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      profile: faker.image.avatar(),
      lastMessage: messagesHistory[messagesHistory.length - 1],
      allMessages: messagesHistory,
      stage: faker.word.noun(),
      qaScore: faker.number.int({ min: 1, max: 5 }),
      breakdown: breakdownData
    };
  });
};

export const clients = [
  {
    name: 'James',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'Email',
    input: 'Hi, how does the prod..',
    output: null
  },
  {
    name: 'James',
    time: 'Fri Aug 30 2024 18:40:15',
    media: 'Email',
    input: null,
    output: 'Hi James, the product..'
  },
  {
    name: 'James',
    time: 'Fri Aug 30 2024 18:41:15',
    media: 'Email',
    input: 'Thanks, lets buy..',
    output: null
  },
  {
    name: 'David',
    time: 'Fri Aug 21 2024 18:38:15',
    media: 'TG',
    input: 'Hi, tell me about the prod..',
    output: null
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:39:15',
    media: 'TG',
    input: null,
    output: 'Hi David, glad you are..'
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:40:15',
    media: 'TG',
    input: 'What about..',
    output: null
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:41:15',
    media: 'TG',
    input: null,
    output: 'That is a feature which...'
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:41:50',
    media: 'Email',
    input: null,
    output: 'David, I would like to followup..'
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:50:15',
    media: 'SMS',
    input: null,
    output: 'It looks like, you are not receivi..'
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:50:50',
    media: 'TG',
    input: 'Ok, how do I..',
    output: null
  },
  {
    name: 'David',
    time: 'Fri Aug 28 2024 18:51:15',
    media: 'TG',
    input: null,
    output: 'Just follow this link..'
  },
  {
    name: 'Larry',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'Email',
    input: 'Hi, how does the prod..',
    output: null
  },
  {
    name: 'Larry',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'Email',
    input: null,
    output: 'Hi Larry, the product..'
  },
  {
    name: 'Larry',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'Email',
    input: 'Thanks, lets buy..',
    output: null
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: 'Hi, tell me about the prod..',
    output: null
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: null,
    output: 'Hi Jetlee, glad you are..'
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: 'What about..',
    output: null
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: null,
    output: 'That is a feature which...'
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'Email',
    input: null,
    output: 'Jetlee, I would like to followup..'
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'SMS',
    input: null,
    output: 'It looks like, you are not receivi..'
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: 'Ok, how do I..',
    output: null
  },
  {
    name: 'Jetlee',
    time: 'Fri Aug 30 2024 18:38:15',
    media: 'TG',
    input: null,
    output: 'Just follow this link..'
  }
];
