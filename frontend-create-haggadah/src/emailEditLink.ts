const emailEditLink = async () => {
  const response = await fetch("../v2/a");
  const data = await response.json();
  const status = response.status;
  return {
    message: data,
    status,
  };
};
export { emailEditLink };
