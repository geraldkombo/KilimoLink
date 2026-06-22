process.env.NODE_ENV = 'development';
process.env.DOCUMENTS_MASTER_KEY_BASE64 = process.env.DOCUMENTS_MASTER_KEY_BASE64 || 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.DISABLE_QUEUES = 'true';
process.env.DISABLE_DB = 'true';
process.env.DISABLE_REDIS = 'true';
process.env.MOCK_PAYMENTS = 'true';
