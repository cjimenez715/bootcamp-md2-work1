import operations from './operators.js'

//1.- Create or/and files
await operations.createStateFiles();

//2.- Get Cities quantity by UF
await operations.getCityQuanityByStateUF('MG');

// //3.- Get top 5 states with the most population desc
await operations.getTop5StatesCitiesMax();

// //4.- Get top 6 states with the less population desc
await operations.getTop5StatesCitiesMin();

// //5 Get States with Longer City Name 
await operations.getStateLongerCityName();

// //6
await operations.getStateSmallerCityName();

//7 Get State with the longer city name
await operations.getLongerStateCity();

//8 
await operations.getSmallerStateCity();
