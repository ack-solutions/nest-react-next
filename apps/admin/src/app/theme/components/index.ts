import { Theme } from '@mui/material';
import { merge } from 'lodash';

import appBar from './appbar';
import Breadcrumbs from './breadcrumbs';
import Card from './card';
import Container from './container';
import Table from './table';
import Tabs from './tabs';


export default function ComponentsOverrides(theme: Theme): any {
    return merge(
        appBar(theme),
        Card(theme),
        Breadcrumbs(theme),
        Table(theme),
        Container(theme),
        Tabs(theme),
    );
}
