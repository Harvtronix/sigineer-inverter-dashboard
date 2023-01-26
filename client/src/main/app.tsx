import '@carbon/styles/css/styles.css'
// Why is this not available as part of the charts package directly? It's a transient dependency
import '@carbon/charts/styles.css'

import { useQuery } from '@apollo/client'
import { Theme } from '@carbon/react'

import BatteryVoltageGauge from './_common/battery-voltage-gauge.js'
import OutputWattsGauge from './_common/output-watts-gauge.js'
import { MAIN_DASHBOARD_QUERY, T_MAIN_DASHBOARD_QUERY } from './queries.js'

const App = () => {
  const { data, error, loading } = useQuery<T_MAIN_DASHBOARD_QUERY>(MAIN_DASHBOARD_QUERY)

  if (loading) {
    return <>Loading...</>
  }

  if (error || !data) {
    console.error(error)

    return <>Error obtaining data: {error}</>
  }

  return (
    <Theme theme="g90">
      <main>
        <h1>Welcome to the dashboard!</h1>
        <div style={{ display: 'flex', height: '175px' }}>
          <div style={{ width: '33%' }}>
            <BatteryVoltageGauge
              maxVoltage={58.4}
              minVoltage={43}
              voltage={data.latestReading.batteryVoltage}
            />
          </div>
          <div style={{ width: '33%' }}>
            <OutputWattsGauge watts={data.latestReading.outputWatts} maxWatts={6000} />
          </div>
        </div>
      </main>
    </Theme>
  )
}

export default App
