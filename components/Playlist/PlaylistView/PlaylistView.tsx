import { LeftArrowIcon } from '@components/Icons'
import { PlayListHeader } from '@components/Playlist/PlayListHeader'
import { TrackCard } from '@components/Playlist/TrackCard'
import { Button, Grid } from '@components/UI'
import player, { usePlayerState } from '@lib/player'
import { Playlist, Track } from '@lib/player/types'
import Link from 'next/link'

export interface props {
  playlist: Playlist
  className?: string
}

const PlaylistView: React.FC<props> = (props) => {
  console.log({ props });

  // let { playlist, className, children, ...rest } = props
  let { className, children, ...rest } = props;
  const playlist: any = {
    id: "1",
    title: "Playlist 1",
    tracks: [
      {
        title: "Music 1",
        url: 'http://127.0.0.1:5000/get-file/00090169-96e2-466c-8cc6-b0e1338c1b29.mp3',
        artist: {
          name: "Dustin pro 1",
        },

      },
      {
        title: "Music 2",
        url: 'http://127.0.0.1:5000/get-file/b1673853-27c4-44fb-a014-28a11dad911b.mp3',
        artist: {
          name: "Dustin pro 1",
        },

      },
      {
        title: "Music 3",
        url: 'http://127.0.0.1:5000/get-file/00090169-96e2-466c-8cc6-b0e1338c1b29.mp3',
        artist: {
          name: "Dustin pro 1",
        },

      },
      {
        title: "Music 4",
        url: 'http://127.0.0.1:5000/get-file/b1673853-27c4-44fb-a014-28a11dad911b.mp3',
        artist: {
          name: "Dustin pro 1",
        },

      }
    ]
  }


  const state = usePlayerState()

  const PlayTrack = (index: number) => {
    if (state.playing && index === state.currentTrackIndex) {
      player.pause()
    } else if (index !== state.currentTrackIndex) {
      player.playTrack(index)
      player.play()
    } else {
      player.play()
    }
  }

  const setQueue = (index?: number) => {
    if (index) {
      player.setQueue(playlist, index)
    } else {
      player.setQueue(playlist, 0)
    }
  }

  const handlePlay = (index?: number) => {
    if (state.playlist.id !== playlist.id) {
      // set Queue
      setQueue(index)
      player.play()
      return
    } else {
      // handle play
      PlayTrack(index || 0)
    }
  }

  return (
    <div>
      <div className="flex flex-col mb-8 items-start">
        <Link href="/">
          <Button variant="ghost">
            <LeftArrowIcon />
            Back to home
          </Button>
        </Link>
      </div>
      <Grid variant="B">
        <PlayListHeader
          playlist_id={playlist?.id || '1'}
          img={playlist?.imageUrl || 'https://picsum.photos/200/300'}
          title={playlist?.title || "1"}
          changePlaylist={() => handlePlay()}
        />
        <div className="flex flex-col gap-6">
          {playlist.tracks.map((track: Track, index: number) => (
            <TrackCard
              onClick={() => handlePlay(index)}
              playlistId={playlist.id}
              title={track.title}
              fileUrl={track.url}
              artist={track.artist.name}
              key={index}
              index={index}
            />
          ))}
        </div>
      </Grid>
    </div>
  )
}

export default PlaylistView
