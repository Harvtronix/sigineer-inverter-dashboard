import '@carbon/styles/css/styles.css'
// Why is this not available as part of the charts package directly? It's a transient dependency
import '@carbon/charts/styles.css'

import { useQuery } from '@apollo/client'
import { Theme } from '@carbon/react'

import BatteryVoltageGauge from '../_common/battery-voltage-gauge.js'
import FullPageError from '../_common/full-page-error.js'
import OutputWattsGauge from '../_common/output-watts-gauge.js'
import { MAIN_DASHBOARD_QUERY, TMainDashboardQuery } from '../queries.js'

const Layout = ({ children }) => {
  return (
    <Theme theme="g90">
      <main>{children}</main>
    </Theme>
  )
}

const DefaultView = () => {
  const { data, error, loading } = useQuery<TMainDashboardQuery>(MAIN_DASHBOARD_QUERY)

  if (loading) {
    return <Layout>Loading...</Layout>
  }

  if (error) {
    return (
      <Layout>
        {error.graphQLErrors.map((err) => {
          return (
            <FullPageError key={err.message} error={err}>
              GraphQL error:
            </FullPageError>
          )
        })}
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <FullPageError>Failed to obtain data</FullPageError>
      </Layout>
    )
  }

  return (
    <Layout>
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
    </Layout>
  )
}

export default DefaultView
