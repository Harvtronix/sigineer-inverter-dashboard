import { GaugeChart } from '@carbon/charts-react'

interface Props {
  watts: number
  maxWatts: number
}

const OutputWattsGauge = ({ watts, maxWatts }: Props) => {
  const vPercent = (watts / maxWatts) * 100

  return (
    <GaugeChart
      data={[
        {
          group: 'value',
          value: vPercent
        }
      ]}
      options={{
        title: 'Output watts',
        // height: '150px',
        toolbar: {
          controls: []
        },
        // these should be allowed to be strings instead of enums
        theme: 'g90',
        gauge: {
          type: 'semi',
          showPercentageSymbol: false,
          numberFormatter: (num: number) => {
            return watts + 'W'
          },
          valueFontSize: () => {
            return 32
          }
        }
      }}
    />
  )
}

export default OutputWattsGauge
