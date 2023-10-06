import s from "./ArtistCard.module.css"
import cn from 'clsx'
import Image from "next/image"
import Link from "next/link"


export interface props {
  name: string
  imgUrl: string
  id: string
  className?: string

}

const ArtistCard: React.FC<props> = (props) => {
  const {
    name,
    imgUrl,
    id,
    className,
    children,
    ...rest
  } = props


  return (
    <div className={cn(s.root)}>
      {/* < */}
      <Image
        className="rounded-md"
        height='64'
        width='64'
        src={imgUrl}
        alt="image"
      />
      <Link href={`/playlist/${encodeURIComponent('best-music')}`}>
        <div className='flex flex-row gap-4 hover:underline hover:cursor-pointer'>
          <h1 className={cn(s.title)} >{name}</h1>
          {children}
        </div>
      </Link>
    </div>
  )
}

export default ArtistCard