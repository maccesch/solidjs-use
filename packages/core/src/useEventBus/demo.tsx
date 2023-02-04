import { createSignal } from 'solid-js'
import { useEventBus } from 'solidjs-use'
const Demo = () => {
  const { on, emit } = useEventBus<string>('vue-use-event-bus')
  const [message, setMessage] = createSignal('')
  const news = [
    'Su Bingtian broke the Asian record and entered the Olympic 100-meter race finals as the first person in China-RTHK',
    'Comprehensive investigation in Zhengzhou to avoid further spread of the epidemic-RTHK',
    '130 stroke experts after vaccination: nothing to do with the vaccine',
    'China adds two gold medals in Olympic diving and weightlifting',
    'Tokyo Olympic service provokes athletes sleeping in cardboard suitcases and eating canned food, reviewing the Beijing Olympics god-level arrangements'
  ]
  on(_message => setMessage(news[Math.floor(Math.random() * news.length)]))

  return (
    <>
      <div style={{ display: 'flex', gap: '100px' }}>
        <div>
          <div class="whitespace-nowrap">News channel:</div>
          <button class="whitespace-nowrap" onClick={() => emit('The Tokyo Olympics has begun')}>
            Broadcast
          </button>
        </div>
        <div>
          <div style="margin-bottom: 13px;">Television:</div>
          <div>{message() || '--- no signal ---'}</div>
        </div>
      </div>
    </>
  )
}

export default Demo
