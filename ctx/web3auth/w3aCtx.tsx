'use client'
import { WALLET_CONNECTORS, WEB3AUTH_NETWORK, type Web3AuthOptions } from '@web3auth/modal'
import { type Web3AuthContextConfig } from '@web3auth/modal/react'

const web3AuthOptions: Web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? '',
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  // Disable account abstraction completely to avoid bundlerConfig errors
  useAAWithExternalWallet: false,
  accountAbstractionConfig: undefined,
  enableLogging: true, // Enable logging to debug issues
  modalConfig: {
    connectors: {
      [WALLET_CONNECTORS.AUTH]: {
        label: 'auth',
        loginMethods: {
          github: {
            name: 'GitHub',
            showOnModal: true
          }
        },
        showOnModal: true
      }
    },
    hideWalletDiscovery: false
  }
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions
}

export default web3AuthContextConfig
