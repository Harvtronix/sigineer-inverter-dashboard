enum HoldingRegister {
  OutputVoltType = 18,
  Serial5 = 23,
  Serial4 = 24,
  Serial3 = 25,
  Serial2 = 26,
  Serial1 = 27
}

enum InputRegister {
  SystemStatus = 0,
  BatteryVolt = 17,
  OutputActivePowerHigh = 9,
  OutputActivePowerLow = 10
}

interface RawReading {
  timestamp: string
  holdingRegisters: {
    [register in HoldingRegister]: number
  }
  inputRegisters: {
    [register in InputRegister]: number
  }
}

interface DB {
  readings: Array<RawReading>
}

enum SortOrder {
  // These are left lowercase since they are used in the GraphQL schema
  asc,
  desc
}

enum NodeEnv {
  Production = 'production',
  Development = 'development'
}

export { DB, HoldingRegister, InputRegister, NodeEnv, RawReading, SortOrder }
