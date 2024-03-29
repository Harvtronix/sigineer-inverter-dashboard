// Why are the options types not exported as part of the charts-react package?
// @carbon/charts is a transient dependency that we aren't told to install
// import {
//   ChartTabularData,
//   ChartTheme,
//   GaugeChartOptions,
//   GaugeTypes
// } from '@carbon/charts/interfaces'
// importing charts/interfaces directly gives an error because of a missing exports map in the package.json
import { GaugeChart } from '@carbon/charts-react'

interface Props {
  inverterRef: string
  voltage: number
  maxVoltage: number
  minVoltage: number
}

const BatteryVoltageGauge = ({ inverterRef, voltage, maxVoltage, minVoltage }: Props) => {
  const vPercent = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100

  return (
    <GaugeChart
      data={[
        {
          group: 'value',
          value: vPercent
        }
      ]}
      options={{
        title: `Battery voltage - ${inverterRef}`,
        toolbar: {
          controls: []
        },
        // these should be allowed to be strings instead of enums
        theme: 'g90' as any,
        gauge: {
          type: 'semi' as any,
          showPercentageSymbol: false,
          numberFormatter: () => {
            return voltage + 'V'
          },
          valueFontSize: () => {
            return 32
          }
        }
      }}
    />
  )
}

export default BatteryVoltageGauge
