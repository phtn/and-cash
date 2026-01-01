import { createClient, CreatePaylinkWithApiDto, MoonpayRequest } from '@/lib/moonpay'

export const POST = async (req: Request) => {
  const { data } = (await req.json()) as MoonpayRequest<CreatePaylinkWithApiDto>

  const mp = createClient()
  const paylink = await mp.paylink.create(data)

  return new Response(JSON.stringify(paylink), { status: 200 })
}
