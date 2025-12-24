export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
        <h1 className='text-6xl font-polysans -space-x-1.5'>
          <span className='opacity-70 font-thin'>&</span>
          <span className='font-black tracking-tighter'>Cash</span>
        </h1>
        <div className='flex flex-col gap-4 text-base font-medium sm:flex-row'>
          <a
            className='flex h-12 w-full items-center justify-center rounded-full gap-3 bg-foreground px-12 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5 font-polysans'
            href={process.env.NEXT_PUBLIC_MELD_URL}
            target='_blank'
            rel='noopener noreferrer'>
            <span className='text-xl font-light! font-polysans'>Start</span>
          </a>
        </div>
      </main>
    </div>
  )
}
