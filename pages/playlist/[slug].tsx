import { Playlist } from '@lib/player/types'
import PlaylistView from '@components/Playlist/PlaylistView'
import { getAllPlaylistsQuery, getPlaylistQuery } from '@graphql/queries'
import { GetStaticPropsContext } from 'next'
import { client } from '@lib/apollo'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PlaylistMelodyView from '../../components/Playlist/PlaylistView/PlaylistMelodyView'

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const slug = params?.slug
  // const { data } = await client.query({
  //   query: getPlaylistQuery,
  //   variables: {
  //     playlistId: slug,
  //   },
  // })

  return {
    props: {
      params,
      data: {
        playlists: [
          {
            id: 1,
            title: 1,
            imageUrl: 1
          }
        ],
        Artists: [{
          id: 1,
          name: 1,
          imageUrl: "https://picsum.photos/200/300"
        }]
      },
    },
  }
}

export async function getStaticPaths() {
  // const { data } = await client.query({
  //   query: getAllPlaylistsQuery,
  // })
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-list`);
  const result = res.data.result.data.map((item: any, idx: number) => {
    return {
      id: item.key,
      title: `${item.key}`,
      imageUrl: "https://picsum.photos/200/300"
    }
  })

  const data: any = {
    playlists: [
      {
        id: 'best-music'
      },
      {
        id: 'melody-music'
      },
      ...result
    ],
    Artists: [
      //   {
      //   id: 1,
      //   name: 1,
      //   imageUrl: "https://picsum.photos/200/300"
      // }
    ]
  };
  const paths = data.playlists.map((playlist: any) => ({
    params: { slug: playlist.id },
  }))

  return { paths, fallback: false }
}

const Playlist = (props: { playlist: Playlist; data: any, params: any }) => {
  const { playlist, data, ...rest } = props;
  const [request, setRequest] = useState(data.playlists);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/get-list`);
      if (res.status == 200) {
        const result = res.data.result.data.map((item: any, idx: number) => {

          return {
            id: item.key,
            title: `${item.key}`,
            imageUrl: "https://picsum.photos/200/300"
          }
        })
        setRequest([...request, ...result])
      }
    })()
  }, [])

  return (
    <div className=''>
      <PlaylistView playlist={request} params={props?.params}></PlaylistView>
      {/* <PlaylistMelodyView playlist={request} params={props?.params}></PlaylistMelodyView> */}
    </div>
  )
}

export default Playlist
