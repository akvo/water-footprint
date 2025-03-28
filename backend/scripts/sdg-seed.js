const fs = require('fs');
const path = require('path');

const SDGs = [
  { name: 'No Poverty', colour: '#E5243B', icon: 'no-poverty.jpg' },
  { name: 'Zero Hunger', colour: '#DDA63A', icon: 'zero-hunger.jpg' },
  {
    name: 'Good Health and Well-Being',
    colour: '#4C9F38',
    icon: 'good-health.jpg',
  },
  {
    name: 'Quality Education',
    colour: '#C5192D',
    icon: 'quality-education.jpg',
  },
  { name: 'Gender Equality', colour: '#FF3A21', icon: 'gender-equality.jpg' },
  {
    name: 'Clean Water and Sanitation',
    colour: '#26BDE2',
    icon: 'clean-water.jpg',
  },
  {
    name: 'Affordable and Clean Energy',
    colour: '#FCC30B',
    icon: 'affordable-energy.jpg',
  },
  {
    name: 'Decent Work and Economic Growth',
    colour: '#A21942',
    icon: 'decent-work.jpg',
  },
  {
    name: 'Industry, Innovation and Infrastructure',
    colour: '#FD6925',
    icon: 'industry-innovation.jpg',
  },
  {
    name: 'Reduced Inequalities',
    colour: '#DD1367',
    icon: 'reduced-inequalities.jpg',
  },
  {
    name: 'Sustainable Cities and Communities',
    colour: '#FD9D24',
    icon: 'sustainable-cities.jpg',
  },
  {
    name: 'Responsible Consumption and Production',
    colour: '#BF8B2E',
    icon: 'responsible-consumption.jpg',
  },
  { name: 'Climate Action', colour: '#3F7E44', icon: 'climate-action.jpg' },
  { name: 'Life Below Water', colour: '#0A97D9', icon: 'life-below-water.jpg' },
  { name: 'Life on Land', colour: '#56C02B', icon: 'life-on-land.jpg' },
  {
    name: 'Peace, Justice and Strong Institutions',
    colour: '#00689D',
    icon: 'peace-justice.jpg',
  },
  {
    name: 'Partnerships for the Goals',
    colour: '#19486A',
    icon: 'partnerships-goals.jpg',
  },
];

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  const filePath = path.join('data', 'sdg-icons', fileName);
  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: 'image/jpeg',
  };
}

async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `An image uploaded to Strapi called ${name}`,
          caption: name,
          name,
        },
      },
    });
}

async function checkFileExistsBeforeUpload(fileName) {
  // Check if the file already exists in Strapi
  const fileWhereName = await strapi.query('plugin::upload.file').findOne({
    where: {
      name: fileName.replace(/\..*$/, ''),
    },
  });

  if (fileWhereName) {
    // File exists, don't upload it
    return fileWhereName;
  }

  // File doesn't exist, upload it
  const fileData = getFileData(fileName);
  const fileNameNoExtension = fileName.split('.').shift();
  const [file] = await uploadFile(fileData, fileNameNoExtension);
  return file;
}

async function seedSDGs() {
  // Programmatically start Strapi
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  console.log('Starting SDG seeding process...');
  try {
    // For each SDG, check if a record with that name exists.
    for (const sdg of SDGs) {
      const existing = await app.db.query('api::sdg.sdg').findOne({
        where: { name: sdg.name },
      });

      // If it doesn't exist, create it.
      if (!existing) {
        const icon = await checkFileExistsBeforeUpload(sdg.icon);
        await strapi.documents(`api::sdg.sdg`).create({
          data: { ...sdg, icon },
        });
        console.log(`Created SDG: "${sdg.name}"`);
      }
    }
  } catch (err) {
    console.error('Error seeding SDGs:', err);
    process.exit(1);
  } finally {
    // Shut down Strapi
    await app.destroy();
    console.log('SDG seeding completed.');
    process.exit(0);
  }
}

seedSDGs();
