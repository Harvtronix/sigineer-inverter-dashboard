import { gql } from '@apollo/client'

const MAIN_DASHBOARD_QUERY = gql`
  query {
    latestReadingSet {
      inverterRef
      timestamp
      batteryVoltage
      outputWatts
    }
  }
`
interface TMainDashboardQuery {
  latestReadingSet: [
    {
      inverterRef: string
      timestamp: string
      batteryVoltage: number
      outputWatts: number
    }
  ]
}

export { MAIN_DASHBOARD_QUERY, TMainDashboardQuery }
