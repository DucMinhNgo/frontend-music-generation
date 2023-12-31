import Head from 'next/head'
import { Grid } from '@components/UI'
import { About, ArtistCard } from '@components/common'
import { PlaylistCard } from '@components/Playlist/PlaylistCard'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link'
import MelodyCard from '../components/common/Artist/ArtistCard/MelodyCard'

export async function getStaticProps() {
  // const { data } = await client.query({
  //   query: getAllPlaylistsQuery,
  // })


  return {
    props: {
      data: {
        playlists: [
          // {
          //   id: '',
          //   title: 'Playlist 1',
          //   imageUrl: "https://picsum.photos/200/300"
          // }
        ],
        Artists: [
          // {
          //   id: '0',
          //   name: 'Artist 1',
          //   imageUrl: "https://picsum.photos/200/300"
          // },
          // {
          //   id: '2',
          //   name: 'Artist 2',
          //   imageUrl: "https://picsum.photos/200/300"
          // }
        ]
      },
    }, // will be passed to the page component as props
  }
}

const GenerateMusic = ({ getRequestList }) => {
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
        <button onClick={async () => {
          if (!text) return;
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/`, {
            lyrics: text.split('\n') || []
          })

          if (res.data.status === 200) {
            setText('');
            await getRequestList();
          }

        }} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
          <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </div >
  </>)
}

const Home = (props: { data: any; error: any }) => {
  const { data, ...rest } = props;
  const [request, setRequest] = useState(data.playlists);
  const [bestMusic, setBestMusic] = useState([]);
  const [melody, setMelody] = useState([]);

  const getRequestList = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-list`);
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

    setRequest([...request, ...result])

    return result;
  }

  useEffect(() => {
    (async () => {
      await getRequestList();
      const intervalId = setInterval(getRequestList, 20000);

      return () => clearInterval(intervalId);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-best-music`);
      setBestMusic(res.data.results.map((item: any, idx: number) => {
        return {
          id: item,
          name: `Music ${idx + 1}`,
          imageUrl: `https://picsum.photos/200/300?random=${Math.random() * 1000}`
        };
      }));

      const res1 = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-melody-music`);
      setMelody(res1.data.results.map((item: any, idx: number) => {
        return {
          id: item,
          name: `Melody ${idx + 1}`,
          imageUrl: `https://picsum.photos/200/300?random=${Math.random() * 1000}`
        };
      }));

    })();
  }, [])

  const removeDuplicates = (arr: any[]) => {
    // Declare a new array
    let newArray = [];

    // Declare an empty object
    let uniqueObject: any = {};

    // Loop for the array elements
    for (let i in arr) {

      // Extract the title
      const objId = arr[i]['id'];

      // Use the title as the index
      uniqueObject[objId] = arr[i];
    }

    // Loop to push unique object into array
    for (let i in uniqueObject) {
      newArray.push(uniqueObject[i]);
    }

    // Display the unique objects
    console.log(newArray);

    return newArray;
  }

  return (
    <div>
      <Head>
        <title>Lofi-App by Achraf Garai</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl font-medium">Music Generation</h1>
      <GenerateMusic getRequestList={getRequestList} />
      <Grid>
        <div className="col-span-2">
          <h1 className="text-2xl font-medium">Request List</h1>
          <div className="flex flex-col max-h-[500px] overflow-y-auto">
            {removeDuplicates(request).sort((a: any, b: any) => a.created_at < b.created_at ? 1 : -1).map((playlist: any) => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                img={playlist.imageUrl}
                results={playlist.results}
                status={playlist.status}
                lyrics={playlist.lyrics}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-medium">Top Music</h1>
          <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto">
            {(bestMusic).map((artist: any) => (
              <ArtistCard
                key={artist.id}
                name={artist.name}
                id={artist.id}
                imgUrl={artist.imageUrl}
              />
            ))}
          </div>
          {/* <About /> */}
          <h1 className="text-xl font-medium">Top Melody</h1>
          <div className="flex flex-col gap-4 max-h-[180px] overflow-y-auto">
            {(melody).map((artist: any) => (
              <MelodyCard
                key={artist.id}
                name={artist.name}
                id={artist.id}
                imgUrl={artist.imageUrl}
              />
            ))}
          </div>
        </div>
      </Grid>
    </div>
  )
}

export default Home
function cn(root: any): string | undefined {
  throw new Error('Function not implemented.')
}
