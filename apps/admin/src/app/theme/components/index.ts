import { Theme } from "@mui/material";

import Card from "./card";
import { merge } from "lodash";
import appBar from "./appbar";
import Breadcrumbs from "./breadcrumbs";
import Table from "./table";

// export const components = {
//   ...appBar,
//   ...Card
// };

export default function ComponentsOverrides(theme: Theme) :any {
  return merge(
    appBar(theme),
    Card(theme),
    Breadcrumbs(theme),
    Table(theme),
  )
}