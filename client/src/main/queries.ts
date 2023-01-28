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
interface TMainDashboardQuery {
  latestReading: {
    timestamp: string
    batteryVoltage: number
    outputWatts: number
  }
}

export { MAIN_DASHBOARD_QUERY, TMainDashboardQuery }
