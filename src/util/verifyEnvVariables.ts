export enum MongoDBUriType {
    MongoDBUri = 'mongodburl'
  }
  
  export enum PortType {
    Port = '0000'
  }
  
  export enum ServerType {
    Server = 'http://localhost'
  }
  
  export enum JwtSecretAccessType {
    JwtSecretAccess = 'jwtsecretkeyaccess'
  }
  
  export enum JwtSecretRefreshType {
    JwtSecretRefresh = 'jwtsecretkeyrefresh'
  }
  
  export enum JwtSecretVerificationType {
    JwtSecretVerification = 'jwtsecretkeyverify'
  }
  
  export enum JwtSecretPassResetType {
    JwtSecretPassReset = 'jwtsecretkeypassreset'
  }
  
  export enum EmailSenderType {
    EmailSender = 'abcd@gmail.com'
  }
  
  export enum EmailSenderPasswordType {
    EmailSenderPassword = 'abcpassword'
  }
  export enum ReturnCode {
    Success,
    InvalidEnv
  }
  declare global {
    namespace NodeJS {
      interface Process {
        logger?: {
          error: (message: string) => void;
          info: (message: string) => void;
          warn: (message: string) => void;
        };
      }
    }
  }
  const logger = {
    error: (message: string) => {
      console.error(`[ERROR]: ${message}`);
    },
    info: (message: string) => {
      console.log(`[INFO]: ${message}`);
    },
    warn: (message: string) => {
      console.warn(`[WARNING]: ${message}`);
    },
  };
  
  const verifyMONGODB_URI = (): string[] => {
    const errors: string[] = [];
    const { MONGODB_URI } = process.env;
  
    if (!MONGODB_URI) {
      errors.push('- MONGODB_URI is missing');
    }
  
    return errors;
  };
  
  const verifyPORT = (): string[] => {
    const errors: string[] = [];
    const { PORT } = process.env;
  
    if (PORT) {
      const port = parseInt(PORT, 10);
      if (isNaN(port) || port <= 0) {
        errors.push(`- PORT '${PORT}' is not a valid positive integer`);
      }
    } else {
      errors.push('- PORT is missing');
    }
  
    return errors;
  };
  
  const verifySERVER = (): string[] => {
    const errors: string[] = [];
    const { SERVER } = process.env;
  
    if (!SERVER) {
      errors.push('- SERVER is missing');
    }
  
    return errors;
  };
  
  const verifyJWT_SECRET_ACCESS = (): string[] => {
    const errors: string[] = [];
    const { JWT_SECRET_ACCESS } = process.env;
  
    if (!JWT_SECRET_ACCESS) {
      errors.push('- JWT_SECRET_ACCESS is missing');
    }
  
    return errors;
  };
  
  const verifyJWT_SECRET_REFRESH = (): string[] => {
    const errors: string[] = [];
    const { JWT_SECRET_REFRESH } = process.env;
  
    if (!JWT_SECRET_REFRESH) {
      errors.push('- JWT_SECRET_REFRESH is missing');
    }
  
    return errors;
  };
  
  const verifyJWT_SECRET_VERIFICATION = (): string[] => {
    const errors: string[] = [];
    const { JWT_SECRET_VERIFICATION } = process.env;
  
    if (!JWT_SECRET_VERIFICATION) {
      errors.push('- JWT_SECRET_VERIFICATION is missing');
    }
  
    return errors;
  };
  
  const verifyJWT_SECRET_PASSRESET = (): string[] => {
    const errors: string[] = [];
    const { JWT_SECRET_PASSRESET } = process.env;
  
    if (!JWT_SECRET_PASSRESET) {
      errors.push('- JWT_SECRET_PASSRESET is missing');
    }
  
    return errors;
  };
  
  const verifyEMAIL_SENDER = (): string[] => {
    const errors: string[] = [];
    const { EMAIL_SENDER } = process.env;
  
    if (!EMAIL_SENDER) {
      errors.push('- EMAIL_SENDER is missing');
    }
  
    return errors;
  };
  
  const verifyEMAIL_SENDER_PASSWORD = (): string[] => {
    const errors: string[] = [];
    const { EMAIL_SENDER_PASSWORD } = process.env;
  
    if (!EMAIL_SENDER_PASSWORD) {
      errors.push('- EMAIL_SENDER_PASSWORD is missing');
    }
  
    return errors;
  };
  
  export const verifyEnvVariables = (): ReturnCode => {
    const errors: string[] = [];
    
    errors.push(...verifyMONGODB_URI());
    errors.push(...verifyPORT());
    errors.push(...verifySERVER());
    errors.push(...verifyJWT_SECRET_ACCESS());
    errors.push(...verifyJWT_SECRET_REFRESH());
    errors.push(...verifyJWT_SECRET_VERIFICATION());
    errors.push(...verifyJWT_SECRET_PASSRESET());
    errors.push(...verifyEMAIL_SENDER());
    errors.push(...verifyEMAIL_SENDER_PASSWORD());
  
    if (errors.length) {
      process.logger?.error(
        `Invalid environment variable(s) provided: \n${errors.join('\n')}`
      );
      return ReturnCode.InvalidEnv;
    }
  
    return ReturnCode.Success;
  };
  