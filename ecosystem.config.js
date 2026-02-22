module.exports = {
  apps: [{
    name: 'inest-backend',
    script: './inest-backend/server.js',
    cwd: '/var/www/inest',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/inest/err.log',
    out_file: '/var/log/inest/out.log',
    log_file: '/var/log/inest/combined.log',
    time: true
  }]
};
