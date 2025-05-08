import { baseApi } from "@/app/baseApi.ts"

export const securityApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSecurityCaptcha: build.query<{url: string}, void>({
      query: () => '/security/get-captcha-url',
    }),
  }),
})

export const {useLazyGetSecurityCaptchaQuery} = securityApi