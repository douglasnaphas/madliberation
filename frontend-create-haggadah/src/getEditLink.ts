const getEditLink = async (props: {
  path: string;
  leaderEmail: string;
  leaderName: string;
}) => {
  const { path, leaderEmail, leaderName } = props;
  const fetchInit = {
    method: "POST",
    body: JSON.stringify({ path, leaderEmail, leaderName }),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch("../v2/edit-link", fetchInit);
  const data = await response.json();
  const status = response.status;
  const lnk =
    `${window.location.origin}/create-haggadah/edit.html` +
    `?sederCode=${data.sederCode}&pw=${data.pw}`;
  return {
    lnk,
    status,
  };
};
export { getEditLink };
