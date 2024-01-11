/**
 * @typedef {Object} Position
 * Conforms to https://jsonresume.org/schema/
 *
 * @property {string} name - Name of the company
 * @property {string} position - Position title
 * @property {string} url - Company website
 * @property {string} startDate - Start date of the position in YYYY-MM-DD format
 * @property {string|undefined} endDate - End date of the position in YYYY-MM-DD format.
 * If undefined, the position is still active.
 * @property {string|undefined} summary - html/markdown summary of the position
 * @property {string[]} highlights - plain text highlights of the position (bulleted list)
 */
const work = [
  {
    name: 'Amazon Web Services',
    position: 'Software Development Engineer II',
    url: 'https://aws.amazon.com/',
    startDate: 'June 2020',
    highlights: [
      'Backend development work with AWS Aurora Database Engine team using C/C++',
      'Core engineer on new Limitless product for Aurora which was presented and explained at 2024 re:Invent (https://aws.amazon.com/about-aws/whats-new/2023/11/amazon-aurora-limitless-database/)',
      'Focused on creating a distributed storage engine that can handle distributed transactions and queries',
      'Filed a patent as lead engineer in a solution using a RL based AI model to predict optimal database configs',
      'Part of core Aurora MySQL team that worked on recent major version, Aurora MySQL 3 (MySQL 8.0)',
    ],
  },
  {
    name: 'Givex',
    position: 'Software Developer',
    url: 'https://www.givex.com/',
    startDate: 'February 2019',
    endDate: 'January 2020',
    highlights: [
      'Backend development work with Python, JavaScript, C/C++, PostgreSQL, and Unix',
      'Implemented gift card, point of sale and other transaction-based solutions for companies such as Nike, McDonalds, Marriott International, and many more',
      'Integrated Apple wallet and Google pay, with web services for both, into our gift card systems',
      'Developed SOAP APIs for integration with third party vendors, such as CAA',
    ],
  },
];

export default work;
