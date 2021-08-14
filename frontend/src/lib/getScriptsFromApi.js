import { Configs } from "../Configs";

function getScriptsFromApi() {
  const scriptsUrl = new URL("./scripts", Configs.apiUrl());
  return fetch(scriptsUrl).then((r) => {
    return r.json();
  });
}

export { getScriptsFromApi };
