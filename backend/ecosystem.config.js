module.exports = {
  apps: [
    {
      name: 'wasmetahir-api',
      script: './server.js',
      cwd: './', // Assuming the command is run from the backend folder
      instances: 'max', // Utilizes all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 6002,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 6002,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true
    }
  ]
};
