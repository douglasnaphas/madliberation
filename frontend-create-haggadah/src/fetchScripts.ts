const fetchScripts = async () => {
  const response = await fetch("../v2/scripts");
  const data = await response.json();
  const status = response.status;
  return {
    data,
    status,
  };
};
export { fetchScripts };
