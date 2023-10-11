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
import Select from "react-select";

export interface props {
  playlist: Playlist
  className?: string
  params: any
}

const colourOptions = [
  { value: "ocean", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

const GenerateMelody = () => {
  const [text, setText] = useState('');

  return (<>
    <div>
      <div className="flex items-center px-3 py-2 my-8 rounded-lg bg-gray-700" color="currentColor">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          id="chat" rows={3} className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
        <button
          onClick={async () => {
            if (!text) return;
            const res = await axios.post('http://127.0.0.1:5000/melody', {
              lyrics: text.split('\n') || []
            })

            if (res.data.status === 200) {
              setText('');
            }

          }}
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
          <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </div >
  </>)
}

const MixMusic = () => {
  const [request, setRequest]: any[] = useState([]);
  const [music, setMusic]: any[] = useState([]);
  const [melody, setMelody]: any[] = useState([]);
  const [state, setState]: any = useState({
    request: {},
    music: {},
    melody: []
  });

  const getRequestList = async () => {
    const res = await axios.get('http://127.0.0.1:5000/get-list');
    let result = [];
    if (res.status == 200) {
      result = res.data.result.data.map((item: any, idx: number) => {
        return {
          id: item.key,
          title: `${item.key}`,
          imageUrl: `https://picsum.photos/200/300?random=${Math.random() * 1000}`,
          ...item.data.request_id.data,
        }
      })
    }

    setRequest(result)

    return result;
  }

  const getMelody = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-melody-music`);
    setMelody((res.data.results || []).map((item: string) => {
      return {
        value: item,
        label: item,
      }
    }))
  }

  useEffect(() => {
    (async () => {
      await getRequestList();
      await getMelody();
    })();
  }, [])

  return (
    <>
      <div className='flex gap-2 mb-[20px]'>
        <div className='w-full'>
          <label>Request</label>
          <Select
            // defaultValue={[colourOptions[1], colourOptions[4]]}
            // isMulti
            name="colors"
            options={request.map((item: any) => {
              return { value: item.id, label: item.id };
            })}
            value={state.request}
            className="w-full text-black"
            classNamePrefix="select"
            onChange={(input: any) => {
              const find = request.find((item: any) => item.id === input.value);

              setMusic(find.results.map((item: string) => {
                return {
                  value: item,
                  label: item
                }
              }) || []);

              setState({
                ...state,
                request: input,
                music: ''
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label>Music</label>
          <Select
            // defaultValue={[colourOptions[1], colourOptions[4]]}
            // isMulti
            name="colors"
            options={music}
            className="w-full text-black"
            classNamePrefix="select"
            value={state.music}
            onChange={(input: any) => {
              setState({
                ...state,
                music: input
              })
            }}
          />
        </div>
        <div className='w-full'>
          <label>Melody</label>
          <Select
            // defaultValue={[colourOptions[1], colourOptions[4]]}
            isMulti
            name="colors"
            options={melody}
            className="w-full text-black"
            classNamePrefix="select"
            value={state.melody}
            onChange={(input: any) => {
              setState({
                ...state,
                melody: input
              })
            }}
          />
        </div>
      </div>
      <div className='flex justify-center mb-[20px]'>
        <Button variant="ghost" onClick={async () => {
          console.log({ state });
          const data = {
            request_id: state.request.value,
            music_id: state.music.value,
            melody: state.melody.map((item: any) => item.value)
          }
          const res = await axios.post('http://127.0.0.1:5000/mix', data);

          if (res.data.status === 200) {
            setState({
              request: {},
              music: {},
              melody: []
            });
          }

        }}>
          Mix Music
        </Button>
      </div>
    </>
  )
}

const PlaylistView: React.FC<props> = (props) => {

  // let { playlist, className, children, ...rest } = props
  let { className, children, ...rest } = props;
  const [playlist, setPlaylist]: any = useState({});

  useEffect(() => {
    (async () => {
      let lyrics = [];
      let tracks = [];
      let melody = [];
      if (props.params.slug === 'best-music') {
        const res = await axios.get(`http://127.0.0.1:5000/get-best-music`);
        tracks = (res.data.results.map((item: any, idx: number) => {
          return {
            id: item,
            title: `Music ${idx + 1}`,
            url: `http://127.0.0.1:5000/get-best-file/${item}`,
            artist: {
              name: item,
            },
          }
        }));
      } else if (props.params.slug === 'melody-music') {
        const res = await axios.get(`http://127.0.0.1:5000/get-melody-music`);
        tracks = (res.data.results.map((item: any, idx: number) => {
          return {
            id: item,
            title: `Melody ${idx + 1}`,
            url: `http://127.0.0.1:5000/get-melody-file/${item}`,
            artist: {
              name: item,
            },
          }
        }));
      }
      else {
        const res = await axios.get(`http://127.0.0.1:5000/get-detail/${props.params.slug}`);
        lyrics = res.data.data.data.request_id.data.lyrics;
        tracks = res.data.data.data.request_id.data.results.map((item: string, idx: number) => ({
          id: item,
          title: `Music ${idx + 1}`,
          url: `http://127.0.0.1:5000/get-file/${item}`,
          artist: {
            name: item,
          },
        }))
        const resMelody = await axios.get(`http://127.0.0.1:5000/get-melody-music`);
        melody = (resMelody.data.results.map((item: any, idx: number) => {
          return {
            id: item,
            title: `Music ${idx + 1}`,
            url: `http://127.0.0.1:5000/get-melody-file/${item}`,
            artist: {
              name: item,
            },
          }
        }));
      }

      setPlaylist({
        id: props.params.slug,
        title: props.params.slug,
        lyrics,
        tracks,
        melody
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
    <div className=''>
      <div className="flex flex-col mb-8 items-start">
        <Link href="/">
          <Button variant="ghost">
            <LeftArrowIcon />
            Back to home
          </Button>
        </Link>
      </div>
      {props.params.slug === 'melody-music' &&
        <>
          <GenerateMelody />
          <MixMusic />
        </>
      }
      <Grid variant="B">
        <PlayListHeader
          playlist_id={playlist?.id}
          img={playlist?.imageUrl || `https://picsum.photos/200/300?random=${Math.random() * 1000}`}
          title={playlist?.title}
          changePlaylist={() => handlePlay()}
        />
        <div className="flex flex-col gap-6 max-h-[450px] overflow-y-auto">
          {(playlist.tracks || []).map((track: Track, index: number) => (
            <TrackCard
              onClick={() => handlePlay(index)}
              playlistId={playlist.id}
              id={track.id}
              title={track.title}
              fileUrl={track.url}
              artist={track.artist.name}
              key={index}
              index={index}
            />
          ))}
        </div>
      </Grid>
      {(playlist.lyrics || []).length > 0 &&
        <>Lyric: <br /></>}
      {(playlist.lyrics || []).map((item: string) => {
        return <div key={item}>
          {item}<br />
        </div>
      })}
    </div >
  )
}

export default PlaylistView
