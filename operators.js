import { promises as fs } from 'fs';
const { writeFile, readFile } = fs;

global.statepath = './states/'
let states = [];
let cities = [];

const mapState = (state) => {
  return {
    ...state,
    FilePath: `${global.statepath}${state.Sigla}.json`
  }
}

const initData = async () => {
  const stateData = await readJSON('./json/Estados.json');
  states = stateData.map(mapState);
  cities = await readJSON('./json/Cidades.json');
};

const readJSON = async (path) => {
  return JSON.parse(await readFile(path, 'utf-8'));
};

const createStateJSON = async ({ ID, Sigla, FilePath }, cities) => {
  try {
    await readJSON(FilePath);
  } catch (err) {
    const data = {
      ID,
      UF: Sigla,
      cities
    }
    await writeFile(FilePath, JSON.stringify(data));
  }
}
const getCitiesByStateID = (city, stateID) => city.Estado === stateID;
const citiesMapped = ({ ID, Nome }) => {
  return {
    ID,
    Nome
  }
}

const createFiles = async () => {
  let citiesFiltered = [];
  states.forEach(async (state) => {
    citiesFiltered = cities
      .filter(city => getCitiesByStateID(city, state.ID))
      .map(citiesMapped);
    await createStateJSON(state, citiesFiltered);
  });
}

const createStateFiles = async () => {
  await initData();
  await createFiles();
};

const getCityQuanityByStateUF = async (uf, showInConsole = true) => {
  const filePath = `${global.statepath}${uf.toUpperCase()}.json`;
  try {
    const stateData = await readJSON(filePath);
    const cityQuantity = stateData.cities.length;
    if (showInConsole) {
      console.log(`State: ${uf.toUpperCase()} Cities: ${cityQuantity}`);
    } else {
      return { UF: uf.toUpperCase(), citiesCounter: cityQuantity }
    }
  } catch (err) {
    console.log(err);
    console.log(`File ${filePath} was not found`);
  }
}

const getStatesUFMapped = (state) => state.Sigla;
const sortStateByCitiesCounterDesc = (a, b) => b.citiesCounter - a.citiesCounter;
const sortStateByCitiesCounterAsc = (a, b) => a.citiesCounter - b.citiesCounter;
const getUFCitiesCounterResultMapped = ({ UF, citiesCounter }) => `${UF} - ${citiesCounter}`;

const getStateCitiesTop5Mapped = async (states) => {
  return Promise.all(states.map(async (state) => {
    return await getCityQuanityByStateUF(state, false);
  }));
}

const getTop5StatesCities = async (option = 'desc') => {
  const UFStates = states.map(getStatesUFMapped);
  const stateCitiesData = await getStateCitiesTop5Mapped(UFStates);

  const stateCitiesResult = stateCitiesData
    .sort((a, b) => option === 'desc' ? sortStateByCitiesCounterDesc(a, b) : sortStateByCitiesCounterAsc(a, b))
    .slice(0, 5);
  return stateCitiesResult
}

const getTop5StatesCitiesMax = async () => {
  const stateCitiesResult = await getTop5StatesCities('desc');
  const result = stateCitiesResult
    .map(getUFCitiesCounterResultMapped);
  console.log(result);
}

const getTop5StatesCitiesMin = async () => {
  const stateCitiesResult = await getTop5StatesCities('asc');
  const result = stateCitiesResult
    .sort(sortStateByCitiesCounterDesc)
    .map(getUFCitiesCounterResultMapped);
  console.log(result);
}

const getStateCitiesData = async (uf) => {
  const filePath = `${global.statepath}${uf.toUpperCase()}.json`;
  try {
    const stateCitiesData = await readJSON(filePath);
    return stateCitiesData;
  } catch (err) {
    console.log(err);
    console.log(`File ${filePath} was not found`);
  }
}

const getStateCitiesResultData = async (states) => {
  return Promise.all(states.map(async (sigla) => {
    return await getStateCitiesData(sigla);
  }));
}

const getUFCitieLongerNameResultMapped = ({ UF, name }) => `${name} - ${UF}`;

const sortByNameLengthAndNameDesc = (a, b) => {
  const l1 = b.nameLenght;
  const l2 = a.nameLenght;

  const s1 = a.name.toLowerCase();
  const s2 = b.name.toLowerCase();

  if (l1 < l2) return -1;
  if (l1 > l2) return 1;
  if (s1 < s2) return -1;
  if (s1 > s2) return 1;
  return 0;
}

const sortByNameLengthAndNameAsc = (a, b) => {
  const l1 = a.nameLenght;
  const l2 = b.nameLenght;

  const s1 = a.name.toLowerCase();
  const s2 = b.name.toLowerCase();

  if (l1 < l2) return -1;
  if (l1 > l2) return 1;
  if (s1 < s2) return -1;
  if (s1 > s2) return 1;
  return 0;
}

const getStateLongerCityName = async () => {
  const UFStates = states.map(getStatesUFMapped);
  const resultData = await getStateCitiesResultData(UFStates);
  const result = resultData.map(({ UF, cities }) => {
    const city = cities.map(({ Nome }) => {
      return { name: Nome, nameLenght: Nome.length };
    }).sort(sortByNameLengthAndNameDesc)[0];

    return {
      UF,
      name: city.name,
      nameLength: city.nameLenght
    }
  })
    .map(getUFCitieLongerNameResultMapped);
  console.log(result);
}

const getStateSmallerCityName = async () => {
  const UFStates = states.map(getStatesUFMapped);
  const resultData = await getStateCitiesResultData(UFStates);
  const result = resultData.map(({ UF, cities }) => {
    const city = cities.map(({ Nome }) => {
      return { name: Nome, nameLenght: Nome.length };
    }).sort(sortByNameLengthAndNameAsc)[0];
    return {
      UF,
      name: city.name,
      nameLength: city.nameLenght
    }
  })
    .map(getUFCitieLongerNameResultMapped);
  console.log(result);
}

const getLongerStateCity = async () => {
  const UFStates = states.map(getStatesUFMapped);
  const resultData = await getStateCitiesResultData(UFStates);
  const result = resultData.map(({ UF, cities }) => {
    const city = cities.map(({ Nome }) => {
      return { name: Nome, nameLenght: Nome.length };
    }).sort(sortByNameLengthAndNameDesc)[0];
    return {
      UF,
      name: city.name,
      nameLenght: city.nameLenght
    }
  })
    .sort(sortByNameLengthAndNameDesc)
    .map(getUFCitieLongerNameResultMapped)[0];
  console.log(result);
}

const getSmallerStateCity = async () => {
  const UFStates = states.map(getStatesUFMapped);
  const resultData = await getStateCitiesResultData(UFStates);
  const result = resultData.map(({ UF, cities }) => {
    const city = cities.map(({ Nome }) => {
      return { name: Nome, nameLenght: Nome.length };
    }).sort(sortByNameLengthAndNameAsc)[0];
    return {
      UF,
      name: city.name,
      nameLenght: city.nameLenght
    }
  })
    .sort(sortByNameLengthAndNameAsc)
    .map(getUFCitieLongerNameResultMapped)[0];
  console.log(result);
}

export default {
  createStateFiles,
  getCityQuanityByStateUF,
  getTop5StatesCitiesMax,
  getTop5StatesCitiesMin,
  getStateLongerCityName,
  getStateSmallerCityName,
  getLongerStateCity,
  getSmallerStateCity
};
