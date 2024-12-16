import { Label, LabelColor, LabelProps } from '@libs/react-core';
import { PageStatusEnum } from '@libs/types';
import { startCase } from 'lodash';
import { useMemo } from 'react';


export interface PageStatusLabelProps extends LabelProps {
    label?: string;
}

const PageStatusLabel = ({ label }: PageStatusLabelProps) => {

    const color: LabelColor = useMemo(() => {
        switch (label) {

            case PageStatusEnum.DRAFT:
                return 'primary'

            case PageStatusEnum.PUBLISHED:
                return 'success'

            case PageStatusEnum.UNPUBLISHED:
                return 'warning'
        }
    }, [label])

    return (
        <Label
            className='status-label'
            color={color}
        >
            {startCase(label)}
        </Label>
    );

}

export default PageStatusLabel
