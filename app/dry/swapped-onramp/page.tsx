import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto py-8 md:py-12'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>Swapped Onramp</h1>
          <p className='text-muted-foreground text-sm md:text-base'>Crypto on-ramp widget integration</p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Widget Tester</CardTitle>
              <CardDescription>Test widget configurations and monitor events</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href='/swapped-onramp/test'>
                <Button className='w-full'>
                  Open Tester
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
