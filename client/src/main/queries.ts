import { gql } from '@apollo/client'

const MAIN_DASHBOARD_QUERY = gql`
  query {
    latestReading {
      timestamp
      batteryVoltage
      outputWatts
    }
  }
`
interface T_MAIN_DASHBOARD_QUERY {
  latestReading: {
    timestamp: string
    batteryVoltage: number
    outputWatts: number
  }
}

export { MAIN_DASHBOARD_QUERY, T_MAIN_DASHBOARD_QUERY }
