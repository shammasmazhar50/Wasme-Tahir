const sequelize = require('./config/database');
const Brand = require('./models/Brand');
const Demographic = require('./models/Demographic');
const CaseStudy = require('./models/CaseStudy');

async function seed4() {
  await sequelize.sync();
  
  await Brand.bulkCreate([
    { name: 'SENDWAVE', order: 1 },
    { name: 'SEPHORA', order: 2 },
    { name: 'REVOLVE', order: 3 },
    { name: 'DYSON', order: 4 },
    { name: 'KHAADI', order: 5 }
  ]);

  await Demographic.bulkCreate([
    { category: 'Gender', data: '85% Female / 15% Male', order: 1 },
    { category: 'Age', data: '65% 25-34 Years Old', order: 2 },
    { category: 'Top Locations', data: '1. New York, USA\n2. London, UK\n3. Toronto, Canada', order: 3 }
  ]);

  await CaseStudy.bulkCreate([
    {
      brandName: 'SENDWAVE',
      campaignTitle: 'Connecting people across borders',
      coverImage: '/images/7E924B31.webp',
      theBrief: 'What the brand wanted to achieve with the Pakistani-American demographic.',
      theConcept: 'How Wasme integrated the brand naturally into her typical family and lifestyle content.',
      stat1Value: '185K+', stat1Label: 'Views',
      stat2Value: '3.1K+', stat2Label: 'Likes',
      order: 1
    },
    {
      brandName: 'FASHION BRAND',
      campaignTitle: 'Fall/Winter Collection Launch',
      coverImage: '/images/24230D23-EA10-4D64-B521-27B9642A07BA.webp',
      theBrief: 'Showcase the latest winter drops.',
      theConcept: 'A multi-part styling series blending traditional elements with contemporary streetwear.',
      stat1Value: '210K+', stat1Label: 'Reach',
      stat2Value: '5.2%', stat2Label: 'Engagement',
      order: 2
    }
  ]);
  
  console.log('Phase 4 Seed Complete!');
  process.exit();
}
seed4();
