export class Logger {
  static log(message, ...args) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args)
  }

  static error(message, error) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error)
  }

  static warn(message, ...args) {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, ...args)
  }

  static info(message, ...args) {
    console.info(`[${new Date().toISOString()}] INFO: ${message}`, ...args)
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`, ...args)
    }
  }
}
