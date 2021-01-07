export function getList() {
    return fetch('https://corona.lmao.ninja/v2/countries?yesterday&sort')
      .then(data => data.json())
  }