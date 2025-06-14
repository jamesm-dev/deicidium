import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
  ],

  css: ['~/assets/css/main.css'],

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      callback: '/auth/callback',
      include: ['/', '/members/*', '/events/*'],
      login: '/auth/login',
      cookieRedirect: true,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    // secret key

    public: {
      baseUrl: process.env.BASE_URL,
    }
  },
})