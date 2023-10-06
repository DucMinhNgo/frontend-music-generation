import React, { useEffect } from 'react'
import player from '@lib/player'

function AudioSetup() {
  useEffect(() => {
    const element: HTMLAudioElement = document.createElement('audio')
    player.setInitialState(element)
  }, [])
  return <></>
}

export default AudioSetup
