'use client'
import { AUTH_CONNECTION, WALLET_CONNECTORS } from '@web3auth/modal'
import { useWeb3AuthConnect, useWeb3Auth } from '@web3auth/modal/react'
import { useState } from 'react'

export const GHConnector = () => {
  const { connectTo, loading, isConnected, error } = useWeb3AuthConnect()
  const { isInitialized, initError } = useWeb3Auth()
  const [isConnecting, setIsConnecting] = useState(false)

  const loginWithGitHub = async () => {
    if (loading || isConnected || isConnecting || !isInitialized) {
      return
    }

    try {
      setIsConnecting(true)
      await connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.GITHUB
      })
    } catch (err) {
      console.error('GitHub login error:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const isDisabled = loading || isConnected || isConnecting || !isInitialized

  const errorMessage = initError instanceof Error 
    ? initError.message 
    : initError 
    ? String(initError) 
    : null

  return (
    <div className="flex flex-col gap-2">
      {errorMessage && (
        <div className="text-red-500 text-sm mb-2" role="alert">
          Initialization error: {errorMessage}
        </div>
      )}
      <button
        onClick={loginWithGitHub}
        disabled={isDisabled}
        className="flex h-12 w-full items-center justify-center rounded-full gap-3 bg-foreground px-12 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed font-polysans">
        {!isInitialized ? 'Initializing...' : isConnecting || loading ? 'Connecting...' : 'Login with GitHub'}
      </button>
      {error && (
        <div className="text-red-500 text-sm" role="alert">
          {error.message || 'An error occurred during login'}
        </div>
      )}
    </div>
  )
}
