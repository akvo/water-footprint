'use strict';

/**
 * sdg service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sdg.sdg');
