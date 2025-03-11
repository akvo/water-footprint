'use strict';

/**
 * compensator service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::compensator.compensator');
