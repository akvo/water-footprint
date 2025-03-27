const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337';
const STRAPI_ADMIN_TOKEN =
  '51b17315429c59bb58f77c13639b722398a330ab7e87431b6a2a9d485b5a9dea39951f9aee52ef24842b42f9c8f4e6adaef850c3ed101d32ec3d8e28c118768639e97bc3a2baeabf6d2a151c90b472a39dfc04334315d084daf7364d053d4259f8614600a8ec8c38eb6ca1a14c64d92e093b2f2c4614406c2fb3b099f32e623f';

const SDGs = [
  { name: 'No Poverty', color: '#E5243B', icon: 'no-poverty.jpg' },
  { name: 'Zero Hunger', color: '#DDA63A', icon: 'zero-hunger.jpg' },
  {
    name: 'Good Health and Well-Being',
    color: '#4C9F38',
    icon: 'good-health.jpg',
  },
  {
    name: 'Quality Education',
    color: '#C5192D',
    icon: 'quality-education.jpg',
  },
  { name: 'Gender Equality', color: '#FF3A21', icon: 'gender-equality.jpg' },
  {
    name: 'Clean Water and Sanitation',
    color: '#26BDE2',
    icon: 'clean-water.jpg',
  },
  {
    name: 'Affordable and Clean Energy',
    color: '#FCC30B',
    icon: 'affordable-energy.jpg',
  },
  {
    name: 'Decent Work and Economic Growth',
    color: '#A21942',
    icon: 'decent-work.jpg',
  },
  {
    name: 'Industry, Innovation and Infrastructure',
    color: '#FD6925',
    icon: 'industry-innovation.jpg',
  },
  {
    name: 'Reduced Inequalities',
    color: '#DD1367',
    icon: 'reduced-inequalities.jpg',
  },
  {
    name: 'Sustainable Cities and Communities',
    color: '#FD9D24',
    icon: 'sustainable-cities.jpg',
  },
  {
    name: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    icon: 'responsible-consumption.jpg',
  },
  { name: 'Climate Action', color: '#3F7E44', icon: 'climate-action.jpg' },
  { name: 'Life Below Water', color: '#0A97D9', icon: 'life-below-water.jpg' },
  { name: 'Life on Land', color: '#56C02B', icon: 'life-on-land.jpg' },
  {
    name: 'Peace, Justice and Strong Institutions',
    color: '#00689D',
    icon: 'peace-justice.jpg',
  },
  {
    name: 'Partnerships for the Goals',
    color: '#19486A',
    icon: 'partnerships-goals.jpg',
  },
];

async function uploadImage(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const formData = new FormData();
  formData.append('files', fileStream, path.basename(filePath));

  try {
    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
      },
    });

    return response.data[0];
  } catch (error) {
    console.error(
      'Error uploading image:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function createSDG(sdgData, imageFile) {
  console.log(imageFile);
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/sdgs`,
      {
        data: {
          name: sdgData.name,
          colour: sdgData.color,
          icon: imageFile ? { id: imageFile.id } : null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      'Error creating SDG:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function seedSDGs() {
  console.log('Starting SDG seeding process...');

  for (const sdg of SDGs) {
    try {
      const iconPath = path.join(__dirname, 'sdg-icons', sdg.icon);
      const uploadedFile = await uploadImage(iconPath);

      // Create SDG
      const createdSDG = await createSDG(sdg, uploadedFile);

      if (createdSDG) {
        console.log(`Created SDG: ${sdg.name}`);
      }
    } catch (error) {
      console.error(`Error seeding SDG ${sdg.name}:`, error);
    }
  }

  console.log('SDG seeding completed.');
}

// Run the seeding process
seedSDGs().catch(console.error);
