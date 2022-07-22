export const getResult = (adressApi, hash) =>
  `${adressApi}/transactions/${hash}`;

export const getTransaction = (adressApi, contract) =>
`${adressApi}/accounts/${contract}/transactions?size=50&withScResults=true&withLogs=true`;