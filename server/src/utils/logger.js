const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || 'info';
  }

  _shouldLog(level) {
    return logLevels[level] <= logLevels[this.level];
  }

  _formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg
    ).join(' ');
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${formattedArgs}`.trim();
  }

  error(message, ...args) {
    if (this._shouldLog('error')) {
      console.error(this._formatMessage('error', message, ...args));
    }
  }

  warn(message, ...args) {
    if (this._shouldLog('warn')) {
      console.warn(this._formatMessage('warn', message, ...args));
    }
  }

  info(message, ...args) {
    if (this._shouldLog('info')) {
      console.info(this._formatMessage('info', message, ...args));
    }
  }

  debug(message, ...args) {
    if (this._shouldLog('debug')) {
      console.debug(this._formatMessage('debug', message, ...args));
    }
  }
}

export const logger = new Logger();