const { createStrapi, compileStrapi } = require('@strapi/strapi');

const projectTypeData = [
  {
    category: 'Ecosystem Restoration & Protection',
    types: [
      'Constructed Wetlands',
      'Wetland Rehabilitation',
      'Floodplain Restoration',
      'Catchment Protection',
      'Invasive Species Removal',
    ],
  },
  {
    category: 'Water Supply & Storage',
    types: [
      'Non-revenue water Reduction',
      'Rainwater Harvesting Systems',
      'Managed Aquifer Recharge (MAR)',
      'Desalination',
      'Sand Dams',
    ],
  },
  {
    category: 'Wastewater Treatment & Reuse',
    types: [
      'Decentralised Wastewater Treatment',
      'Eco-sanitation systems',
      'Water Recycling & Reuse',
      'Agriculture & Industry Water Efficiency',
      'Advanced Irrigation Efficiency',
    ],
  },
  {
    category: 'Urban & Climate Resilience Solutions',
    types: [
      'Rain Gardens & Green Infrastructure',
      'Permeable Pavements',
      'Smart Water Management',
    ],
  },
];

async function seedProjectTypes() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('Starting Project Type Category + Types seeding...');
  try {
    for (const { category, types } of projectTypeData) {
      // Check if category exists
      let existingCategory = await app.db
        .query('api::project-type-category.project-type-category')
        .findOne({ where: { name: category } });

      if (!existingCategory) {
        existingCategory = await app.db
          .query('api::project-type-category.project-type-category')
          .create({ data: { name: category } });

        console.log(`Created category: ${category}`);
      }

      for (const type of types) {
        const existingType = await app.db
          .query('api::project-type.project-type')
          .findOne({ where: { title: type } });

        if (!existingType) {
          await app.db.query('api::project-type.project-type').create({
            data: {
              title: type,
              project_type_category: existingCategory.id,
            },
          });
          console.log(`  → Added type: ${type}`);
        }
      }
    }
  } catch (err) {
    console.error('Error seeding project types:', err);
    process.exit(1);
  } finally {
    await app.destroy();
    console.log('Seeding completed.');
    process.exit(0);
  }
}

seedProjectTypes();
