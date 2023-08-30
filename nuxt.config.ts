// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    sourcemap: {
      server: true,
      client: true
    },

    runtimeConfig: {
        // IAM token secrets. Please rotate every 2 - 4 weeks
        iamAccessTokenSecret: process.env.IAM_ACCESS_TOKEN_SECRET,
        iamRefreshTokenSecret: process.env.IAM_REFRESH_TOKEN_SECRET,
        iamResetTokenSecret: process.env.IAM_RESET_TOKEN_SECRET,
        iamVerifyTokenSecret: process.env.IAM_VERIFY_TOKEN_SECRET,
    
        // Public Url
        iamPublicUrl: process.env.IAM_PUBLIC_URL,
    
        // IAM Emailer
        iamEmailer: process.env.IAM_EMAILER,
    
        // nodemailer-service
        iamNodemailerService: process.env.IAM_NODEMAILER_SERVICE,
        iamNodemailerServiceSender: process.env.IAM_NODEMAILER_SERVICE_SENDER,
        iamNodemailerServicePassword: process.env.IAM_NODEMAILER_SERVICE_PASSWORD,
    
        // nodemailer-smtp
        iamNodemailerSmtpHost: process.env.IAM_NODEMAILER_SMTP_HOST,
        iamNodemailerSmtpPort: process.env.IAM_NODEMAILER_SMTP_PORT,
        iamNodemailerSmtpSender: process.env.IAM_NODEMAILER_SMTP_SENDER,
        iamNodemailerSmtpPassword: process.env.IAM_NODEMAILER_SMTP_PASSWORD,
    
        // IAM SendGrid
        iamSendGridApiKey: process.env.IAM_SENDGRID_API_KEY,
        iamSendgridSender: process.env.IAM_SENDGRID_SENDER,
    
        // GOOGLE CLIENT ID
        iamGoogleClientId: process.env.IAM_GOOGLE_CLIENT_ID,
    
        // Do not put secret information here
        public: {
          iamVerifyRegistrations: process.env.IAM_VERIFY_REGISTRATIONS,
          iamAllowGoogleAuth: process.env.IAM_ALLOW_GOOGLE_AUTH,
        },

        //Washpoint Mqtt Configuration
        // configName: process.env.WASHPOINT_CONFIGNAME,
        mqttHost: process.env.WASHPOINT_MQTTHOST,
        mqttPort: process.env.WASHPOINT_MQTTPORT,
        mqttUser: process.env.WASHPOINT_MQTTUSER,
        mqttPass: process.env.WASHPOINT_MQTTPASS,
        
      },

    css:[
        '@quasar/extras/mdi-v7/mdi-v7.css',
        '~/assets/styles/quasar.sass',
    ],
    modules: [
        "nuxt-vue3-google-signin", 
        "@pinia/nuxt",
        'nuxt-quasar-ui',
      ],

    quasar: {
      plugins: [
        'BottomSheet',
        'Dialog',
        'Loading',
        'LoadingBar',
        'Notify',
        'Dark',
      ],
      extras: {
        font: 'roboto-font',
        fontIcons: ['material-icons'],
      },
    },
    vite:{
      server:{
        hmr:{
          overlay:false
        }
      }
    },
        // Google sign in
    googleSignIn: {
      clientId: process.env.IAM_GOOGLE_CLIENT_ID,
    },

    typescript: {
      shim: false,
    },
})
