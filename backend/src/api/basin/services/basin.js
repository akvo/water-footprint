'use strict';

/**
 * basin service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::basin.basin');
