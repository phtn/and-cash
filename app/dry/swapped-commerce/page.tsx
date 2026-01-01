'use client'

import { Suspense } from 'react'
import { Content } from './content'

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Content />
  </Suspense>
)

export default Page
