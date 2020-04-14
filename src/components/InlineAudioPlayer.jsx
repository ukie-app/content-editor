import React from 'react'
import AudioPlayer from 'react-modular-audio-player'

const InlineAudioPlayer = ({ audioSrc, text }) => {

  // console.log("RECEIVED PROPS: ", audioSrc, text)

  let rearrangedPlayer = [
    {
      className: "letter-audio",
      style: { color: "blue" },
      innerComponents: [
        {
          type: "play",
        },
      ],
    },
  ]

  return (
    <div className="inline-flex inline-highlight mb-4">
      <AudioPlayer
        audioFiles={[
          {
            src: audioSrc,
          },
        ]}
        rearrange={rearrangedPlayer}
        // playerWidth="1rem"
        iconSize="1rem"
        playIcon="https://image.flaticon.com/icons/svg/31/31128.svg"
        playHoverIcon="https://image.flaticon.com/icons/svg/31/31128.svg"
        pauseIcon="https://image.flaticon.com/icons/svg/31/31002.svg"
        pauseHoverIcon="https://image.flaticon.com/icons/svg/31/31002.svg"
      />
      <span >{text}</span>
    </div>
  )
}

export default InlineAudioPlayer