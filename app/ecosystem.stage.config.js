/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "pmread-stage-frontend",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
        HOSTNAME: "127.0.0.1",
      },
      kill_timeout: 5000,
      listen_timeout: 15000,
      restart_delay: 500,
      max_restarts: 5,
      min_uptime: "10s",
      error_file: "/var/log/pm2/pmread-stage-frontend-error.log",
      out_file: "/var/log/pm2/pmread-stage-frontend-out.log",
      merge_logs: true,
    },
  ],
};
