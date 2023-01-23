import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'

import BatteryVoltageGauge from './_common/battery-voltage-gauge'
import OutputWattsGauge from './_common/output-watts-gauge'

const Index: NextPage<any> = ({ data, errors }) => {
  return (
    <div>
      <Head>
        <title>Inverter Dashboard</title>
        <meta name="description" content="Sigineer inverter dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    </div>
  )
}

export const getServerSideProps = async () => {
  const HOST = 'http://localhost:4000/graphql'

  const client = new ApolloClient({
    uri: HOST,
    cache: new InMemoryCache()
  })

  const response = await client.query({
    query: gql`
      query {
        latestReading {
          timestamp
          batteryVoltage
          outputWatts
        }
      }
    `
  })

  return {
    props: {
      data: response.data || null,
      errors: response.errors || null
    }
  }
}

export default Index
