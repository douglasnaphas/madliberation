import { Configs } from "../Configs";

async function getScriptsFromApi() {
  const scriptsUrl = new URL("./scripts", Configs.apiUrl());
  const r = await fetch(scriptsUrl);
  return await r.json();
}

export { getScriptsFromApi };
