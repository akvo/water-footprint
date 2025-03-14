'use strict';

/**
 * update service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::update.update');
