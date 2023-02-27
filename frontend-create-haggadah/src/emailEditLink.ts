const emailEditLink = async () => {
  const response = await fetch("../v2/edit-link");
  const data = await response.json();
  const status = response.status;
  return {
    data,
    status,
  };
};
export { emailEditLink };
