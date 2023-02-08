import { Interpolation, Theme } from "@emotion/react";

function createStyles<T extends { [key: string]: Interpolation<Theme> }>(
  arg: T
): T {
  return arg;
}
// export { createStyles }
const madLiberationStyles = createStyles({
  red: { color: "red" },
  italic: { fontStyle: "italic" },
  blue: { color: "blue" },
  blueItalic: { color: "blue", fontStyle: "italic" },
  lightGrayBackround: { backgroundColor: "lightgray" },
  paper: {
    display: "inline-block",
    padding: "3px",
    margin: "2px",
  },
  whitePaper: {
    backgroundColor: "white",
    color: "black",
    padding: "20px",
  },
  input: {
    display: "none",
  },
  paperContainer: {
    height: 1356,
    backgroundImage: `url(${"../background-red-sea.jpg"})`,
  },
  typography: {
    marginLeft: "20px",
    marginRight: "20px",
  },
});
export { madLiberationStyles };
