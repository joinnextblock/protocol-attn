import debug from 'debug';

const logger = debug('promo');
const logger_dvmcp = debug('promo:dvmcp');
const logger_match_maker = debug('promo:match-maker');
const logger_marketplace = debug('promo:marketplace');

export { logger, logger_dvmcp, logger_match_maker, logger_marketplace };
