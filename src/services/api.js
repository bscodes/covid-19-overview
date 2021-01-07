export async function getList() {
    return await fetch('https://corona.lmao.ninja/v2/countries?yesterday&sort')
      .then(data => data.json())
  }