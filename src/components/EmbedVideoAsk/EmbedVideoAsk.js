import React, { useEffect, useState } from 'react'

const EmbedVideoAsk = () => {
  const [isReady, setReady] = useState(false)
  useEffect(() => {
    updateWindow()
    setReady(true)
  }, [])

  const updateWindow = () => {
    try {
      if (window) {
        window.videoask.loadEmbed({
          kind: 'widget',
          url: 'https://www.videoask.com/fm3m6mpvx',
          options: {
            widgetType: 'VideoThumbnailExtraLarge',
            text: '',
            backgroundColor: '#4699A7',
            position: 'bottom-left'
          }
        })

        setTimeout(() => {
          window.videoask.loadEmbed({})
          console.log('ran')
        }, 3000)
        // window.VIDEOASK_EMBED_CONFIG = {
        //   kind: 'widget',
        //   url: 'https://www.videoask.com/fm3m6mpvx',
        //   options: {
        //     widgetType: 'VideoThumbnailExtraLarge',
        //     text: '',
        //     backgroundColor: '#4699A7',
        //     position: 'bottom-right'
        //   }
        // }
        // const script = document.createElement('script')
        //
        // script.src = 'https://www.videoask.com/embed/embed.js'
        // script.async = true
        //
        // document.body.appendChild(script)
        //
        // return () => {
        //   document.body.removeChild(script)
        // }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    isReady ? <div/> : null
  )
}

export default EmbedVideoAsk
