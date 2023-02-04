import { stringify } from '@solidjs-use/docs-utils'
import { usePermission } from 'solidjs-use'

const Demo = () => {
  const accelerometer = usePermission('accelerometer')
  const accessibilityEvents = usePermission('accessibility-events')
  const ambientLightSensor = usePermission('ambient-light-sensor')
  const backgroundSync = usePermission('background-sync')
  const camera = usePermission('camera')
  const clipboardRead = usePermission('clipboard-read')
  const clipboardWrite = usePermission('clipboard-write')
  const gyroscope = usePermission('gyroscope')
  const magnetometer = usePermission('magnetometer')
  const microphone = usePermission('microphone')
  const notifications = usePermission('notifications')
  const paymentHandler = usePermission('payment-handler')
  const persistentStorage = usePermission('persistent-storage')
  const push = usePermission('push')
  const speaker = usePermission('speaker')

  return (
    <>
      <pre>
        {stringify({
          accelerometer,
          accessibilityEvents,
          ambientLightSensor,
          backgroundSync,
          camera,
          clipboardRead,
          clipboardWrite,
          gyroscope,
          magnetometer,
          microphone,
          notifications,
          paymentHandler,
          persistentStorage,
          push,
          speaker
        })}
      </pre>
    </>
  )
}

export default Demo
