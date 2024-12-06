import { useMemo } from 'react';
import { startCase } from 'lodash';
import { Label, LabelColor, LabelProps } from '@libs/react-core';
import { PageStatusEnum } from '@libs/types';


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

            default:
                return 'secondary'
        }
    }, [label])

    return (
        <Label className='status-label' color={color}>
            {startCase(label)}
        </Label>
    );

}

export default PageStatusLabel
