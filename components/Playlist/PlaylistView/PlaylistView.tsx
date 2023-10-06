import { LeftArrowIcon } from '@components/Icons'
import { PlayListHeader } from '@components/Playlist/PlayListHeader'
import { TrackCard } from '@components/Playlist/TrackCard'
import { Button, Grid } from '@components/UI'
import player, { usePlayerState } from '@lib/player'
import { Playlist, Track } from '@lib/player/types'
import axios from 'axios'
import Link from 'next/link'
import { log } from 'nexus/dist/utils'
import { useEffect, useState } from 'react'

export interface props {
  playlist: Playlist
  className?: string
  params: any
}

const PlaylistView: React.FC<props> = (props) => {

  // let { playlist, className, children, ...rest } = props
  let { className, children, ...rest } = props;
  const [playlist, setPlaylist]: any = useState({});

  useEffect(() => {
    (async () => {
      const res = await axios.get(`http://127.0.0.1:5000/get-detail/${props.params.slug}`);
      console.log(res.data.data.data.request_id.data.results);

      setPlaylist({
        id: props.params.slug,
        title: props.params.slug,
        tracks: res.data.data.data.request_id.data.results.map((item: string, idx: number) => ({
          title: `Music ${idx + 1}`,
          url: `http://127.0.0.1:5000/get-file/${item}`,
          artist: {
            name: props.params.slug,
          },
        }))
      })
    })();
  }, [])


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
          playlist_id={playlist?.id}
          img={playlist?.imageUrl || 'https://picsum.photos/200/300'}
          title={playlist?.title}
          changePlaylist={() => handlePlay()}
        />
        <div className="flex flex-col gap-6">
          {(playlist.tracks || []).map((track: Track, index: number) => (
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
