module.exports = {
  apps : [
    {
      script: './build/server.js',
      instances: 2,  
      exec_mode: 'cluster',
      watch: '.'
  }, 
    {
      name: 'email-worker',
      script: './build/services/email-service.js',
      instances: 1, 
      exec_mode: 'fork'
    },
  {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

