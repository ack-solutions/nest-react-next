import React from 'react';


export interface DateRange {
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

export type Setter<T> =
    | React.Dispatch<React.SetStateAction<T>>
    | ((value: T) => void);

export enum NavigationAction {
    PREVIOUS = -1,
    NEXT = 1,
}

export type DefinedRange = {
    startDate: moment.Moment;
    endDate: moment.Moment;
    label: string;
};
