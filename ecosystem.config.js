const apps = [
  {
    name: "jobdlink",
    script: "npm -- run start",
    env_production: {
      LINKEDIN_CLIENT_ID: "774ljrrsimfvgv",
      LINKEDIN_CLIENT_SECRET: "jzcT9EGzyzbYQeRg",
      MYSQL_PASSWORD: "kirk8242",
      SECRET_KEY: "secretkeyforjwt",
      SESSION_SECRET: "mustbeasecret",
      NODE_ENV: "production",
      PORT: 3001,
      BASE_URL: "https://jobd.link",
    },
  },
];
