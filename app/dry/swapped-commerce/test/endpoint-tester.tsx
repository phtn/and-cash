'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Play, RefreshCw } from 'lucide-react'
import { ENDPOINTS } from './endpoint-config'
import { ParamsInputs } from './params-inputs'
import { ResponseDisplay } from './response-display'
import { useEndpointTester } from './use-endpoint-tester'

export const EndpointTester = () => {
  const {
    selectedEndpoint,
    params,
    loading,
    loadingIds,
    response,
    error,
    availableIds,
    availableCurrencies,
    handleEndpointSelect,
    handleParamChange,
    executeEndpoint,
    fetchAvailableIds,
    fetchAvailableCurrencies,
    fetchOrderDetails,
    setResponse,
    setError
  } = useEndpointTester()

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Endpoint Selection */}
      <Card className='lg:sticky lg:top-4 lg:h-fit text-dark'>
        <CardHeader>
          <CardTitle>Select Endpoint</CardTitle>
          <CardDescription className='font-sans'>Choose an endpoint to test</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Select
            value={selectedEndpoint ? `${selectedEndpoint.category}.${selectedEndpoint.method}` : ''}
            onValueChange={(value) => {
              const endpoint = ENDPOINTS.find((e) => `${e.category}.${e.method}` === value)
              if (endpoint) handleEndpointSelect(endpoint)
            }}>
            <SelectTrigger className='w-full bg-amber-100'>
              <SelectValue placeholder='Select an endpoint...' />
            </SelectTrigger>
            <SelectContent>
              {ENDPOINTS.map((endpoint) => (
                <SelectItem
                  key={`${endpoint.category}.${endpoint.method}`}
                  value={`${endpoint.category}.${endpoint.method}`}>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{endpoint.label}</span>
                    <span className='text-xs text-muted-foreground'>{endpoint.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEndpoint && (
            <>
              <div className='pt-4 border-t space-y-4'>
                <ParamsInputs
                  endpoint={selectedEndpoint}
                  params={params}
                  availableIds={availableIds}
                  availableCurrencies={availableCurrencies}
                  loadingIds={loadingIds}
                  onParamChange={handleParamChange}
                  onFetchIds={fetchAvailableIds}
                  onFetchCurrencies={fetchAvailableCurrencies}
                />
              </div>
              <Button onClick={executeEndpoint} disabled={loading} className='w-full'>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className='mr-2 h-4 w-4' />
                    Execute
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Response Display */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Response</CardTitle>
              <CardDescription>API response will appear here</CardDescription>
            </div>
            {response !== null && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setResponse(null)
                  setError(null)
                }}>
                <RefreshCw className='h-4 w-4' />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponseDisplay
            response={response}
            error={error}
            loading={loading}
            onFetchOrderDetails={fetchOrderDetails}
          />
        </CardContent>
      </Card>
    </div>
  )
}
