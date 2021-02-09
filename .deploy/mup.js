module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: "104.248.178.201",
      username: "root",
      // pem: './path/to/pem'
      password: "XD2-N&a4yP+eJpwCH",
      // or neither for authenticate from ssh-agent
    },
  },

  app: {
    // TODO: change app name and path
    name: "trip-risk",
    path: "../",

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      // ROOT_URL: "https://104.248.178.201",
      ROOT_URL: "https://myflightrisk.com",
      MONGO_URL: "mongodb://mongodb/meteor",
      MONGO_OPLOG_URL: "mongodb://mongodb/local",
    },

    docker: {
      // abernix/meteord:node-12-base works with Meteor 1.9 - 1.10
      // If you are using a different version of Meteor,
      // refer to the docs for the correct image to use.
      image: "abernix/meteord:node-12-base",
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  mongo: {
    version: "3.4.1",
    servers: {
      one: {},
    },
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: "myflightrisk.com,www.myflightrisk.com",

    ssl: {
      // Enable Let's Encrypt
      letsEncryptEmail: "austin.radall.47@gmail.com",
      forceSSL: true,
    },
  },
};
