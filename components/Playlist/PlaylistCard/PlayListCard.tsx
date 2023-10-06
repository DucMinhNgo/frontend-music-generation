import Image from 'next/image'
import Link from 'next/link'
import s from './PlaylistCard.module.css'
import cn from 'clsx'
import { Button } from '../../UI'
import { PlayIcon, PlayingIcon } from '@components/Icons'
import { usePlayerState } from '../../../lib/player'

export interface props {
  id: string
  img: string
  title: string
  className?: string
  results: [],
  status: string
}

const PlaylistCard: React.FC<props> = (props) => {
  const { id, img, title, className, results, status, children, ...rest } = props

  const state = usePlayerState()

  return (
    <div className={cn(s.root)} key={id}>
      <main className="w-full items-center justify-center">
        <article className={`group relative flex h-[12rem] w-[50-rem] overflow-hidden ${status !== 'completed' ? 'rounded-t-2xl' : 'rounded-2xl'} bg-[#3a4448]`}>
          <aside className="absolute right-0 flex1 h-full flex-col justify-center space-y-8 p-3">
            <svg className="invisible h-7 w-7 text-stone-200 opacity-0 transition-all hover:scale-[120%] hover:text-white group-hover:visible group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>

            <svg className="invisible h-7 w-7 text-stone-200 opacity-0 transition-all hover:scale-[120%] hover:text-white group-hover:visible group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </aside>

          <div className="absolute inset-y-0 left-0 w-48">
            <img src="https://unsplash.it/id/1/640/425" alt="" className="h-full w-full object-cover object-center opacity-95" />

            <div className="invisible absolute inset-0 flex h-full w-full items-center justify-center bg-[#0c0c0c]/70 opacity-0 transition-all group-hover:visible group-hover:opacity-100">

              {state.playing && state.playlist.id === id ? (
                <Link href={`/playlist/${encodeURIComponent(id)}`}>
                  <Button variant="ghost">
                    <PlayingIcon />
                  </Button>
                </Link>
              ) : (
                <Link href={`/playlist/${encodeURIComponent(id)}`}>
                  <Button>
                    <svg className="h-w-14 w-14 cursor-pointer text-white transition-all hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                    </svg>
                    {/* <PlayIcon /> */}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="absolute inset-y-0 left-44 w-[39rem] overflow-hidden rounded-2xl transition-all group-hover:w-[36rem]">
            <div
              style={{
                backgroundImage: "url('https://unsplash.it/id/1/640/425')"
              }}
              // styles="background-image: url('https://unsplash.it/id/1/640/425')" 
              className="h-full w-full bg-cover bg-center">
              <div className="h-full w-full bg-[#455055]/80 transition-all group-hover:bg-[#31383b]/80"></div>
            </div>

            <section className="absolute inset-0 flex flex-col justify-between p-4 text-white">
              <header className="space-y-1">
                <Link href={`/playlist/${encodeURIComponent(id)}`}>
                  <div className="font-medium hover:underline hover:cursor-pointer">{title}</div>
                </Link>
                <div className="text-sm">
                  {/* mapped by */}
                  <a href="#" className="text-[#96bacc] transition-all hover:text-yellow-400">Dustin Pro</a>
                </div>
                <div className="font-medium">{results.length}/5</div>

              </header>

              <div className="invisible flex space-x-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <span className="flex items-center space-x-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <div>33</div>
                </span>

                <span className="flex items-center space-x-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>75.7k</div>
                </span>

                <span className="flex items-center space-x-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>5 October 2023</div>
                </span>
              </div>

              <div className="flex space-x-2">
                {state.playing && state.playlist.id === id ? (
                  <Link href={`/playlist/${encodeURIComponent(id)}`}>
                    <Button variant="ghost">
                      <PlayingIcon />
                      Playing now
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/playlist/${encodeURIComponent(id)}`}>
                    <Button>
                      <PlayIcon />
                      Listen Now
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-1">
                  <span className="h-5 w-2 rounded-full bg-red-500"></span>
                  <span className="h-5 w-2 rounded-full bg-green-500"></span>
                  <span className="h-5 w-2 rounded-full bg-yellow-500"></span>
                </div>
              </div>
            </section>
          </div>
        </article>
        {status !== 'completed' && <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-b-2xl animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>}
      </main>
      {/* <Link href={`/playlist/${encodeURIComponent(id)}`}>
        <a>
          <Image className={cn(s.img)} height={100} width={100} src={img} />
        </a>
      </Link> */}
      {/* <div className={cn(s.cardInfo)}>
        <h1 className={cn(s.title)}>{title}</h1>
        {state.playing && state.playlist.id === id ? (
          <Link href={`/playlist/${encodeURIComponent(id)}`}>
            <Button variant="ghost">
              <PlayingIcon />
              Playing now
            </Button>
          </Link>
        ) : (
          <Link href={`/playlist/${encodeURIComponent(id)}`}>
            <Button>
              <PlayIcon />
              Listen Now
            </Button>
          </Link>
        )}
      </div> */}
    </div>
  )
}
export default PlaylistCard
