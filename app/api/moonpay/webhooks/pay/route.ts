export const POST = async (req: Request) => {
  const data = await req.json()

  return new Response(JSON.stringify(data), { status: 200 })
}
