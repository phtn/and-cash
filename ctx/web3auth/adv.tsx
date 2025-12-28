'use client'
import { MFA_LEVELS, WALLET_CONNECTORS, WEB3AUTH_NETWORK, type Web3AuthOptions } from '@web3auth/modal'
import { type Web3AuthContextConfig } from '@web3auth/modal/react'

const web3AuthOptions: Web3AuthOptions = {
  clientId: 'YOUR_WEB3AUTH_CLIENT_ID', // Pass your Web3Auth Client ID, ideally using an environment variable
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  modalConfig: {
    connectors: {
      [WALLET_CONNECTORS.AUTH]: {
        label: 'auth',
        loginMethods: {
          google: {
            name: 'google login'
            // logoDark: "url to your custom logo which will shown in dark mode",
          },
          facebook: {
            name: 'facebook login',
            showOnModal: false // hides the facebook option
          },
          email_passwordless: {
            name: 'email passwordless login',
            showOnModal: true,
            authConnectionId: 'w3a-email_passwordless-demo'
          },
          sms_passwordless: {
            name: 'sms passwordless login',
            showOnModal: true,
            authConnectionId: 'w3a-sms_passwordless-demo'
          }
        },
        showOnModal: true // set to false to hide all social login methods
      }
    },
    hideWalletDiscovery: true // set to true to hide external wallets discovery
  },
  mfaLevel: MFA_LEVELS.MANDATORY
}

export const w3aAdvConfig: Web3AuthContextConfig = {
  web3AuthOptions
}
