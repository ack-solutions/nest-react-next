import { QueryBuilder } from '@ackplus/nest-crud-request';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    Typography,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
    TableCellProps,
    TableBody,
    TablePagination,
    styled,
    Toolbar,
    InputAdornment,
    OutlinedInput,
    Skeleton,
    IconButton,
    CardHeader,
    Stack,
    Divider,
    BoxProps,
    alpha,
    CheckboxProps,
    Collapse,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { chain, debounce, filter, get, upperCase } from 'lodash';
import {
    forwardRef,
    Fragment,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';

import { DataTableFilters } from './data-table-filters';
import useDebounce from '../../hook/use-debounce';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export interface DataTableColumn<T> {
    name: string;
    defaultValue?: any;
    label?: string | ReactNode;
    isSortable?: boolean;
    isSearchable?: boolean;
    isHidden?: boolean;
    isAction?: boolean;
    props?: TableCellProps;
    render?: (row?: T) => ReactNode;
    skeletonRender?: () => ReactNode;
}

export interface DataTableHandle {
    search: (text?: string) => void;
    refresh: (reset?: boolean) => void;
    clearSelection: () => void;
}

export interface DataTableChangeEvent {
    orderBy: string;
    order: 'asc' | 'desc';
    limit: number;
    page: number;
    filter: {
        [x: string]: any;
        searchIn: string[];
        search: string;
    };
}

export interface IDataTableFilter {
    [x: string]: any;
    skip?: number,
    take?: number,
    orderBy?: string,
    order?: 'asc' | 'desc',
    search?: string,
    searchIn?: string[],
}

export interface DataTableProps
    extends Omit<BoxProps, 'onChange' | 'onSelect'> {
    columns: DataTableColumn<any>[];
    data: any[] | null;
    isLoading?: boolean;
    defaultOrder?: 'asc' | 'desc';
    defaultOrderBy?: string;
    idKey?: string;
    limit?: number;
    totalRow?: number;
    initialLoading?: boolean;
    selectable?: boolean;
    collapsible?: boolean | ((row: any) => boolean);
    hasFilter?: boolean;
    hideSearch?: boolean;
    renderBulkAction?: (selectedIds: string[]) => ReactNode;
    onSortChange?: (event: { order: string; orderBy: 'asc' | 'desc' }) => void;
    onPageChange?: (pageNumber: number) => void;
    onLimitChange?: (limit: number) => void;
    onSelect?: (event: string[]) => void;
    onChange?: (event: DataTableChangeEvent, queryBuilder?: QueryBuilder) => void;
    onSelectionChange?: (selectedRowIds: string[]) => void;
    onRowClick?: (event: any) => void;
    renderDetailRow?: (row: any) => ReactNode;
    handleDataLoad?: (queryBuilder?: QueryBuilder, filters?: IDataTableFilter) => void;
    handleDataLoadFilters?: (queryBuilder?: QueryBuilder, filters?: IDataTableFilter) => QueryBuilder | Promise<QueryBuilder>;
    detailRowTitle?: string | ReactNode;
    cardProps?: BoxProps;
    size?: 'small' | 'medium';
    topAction?: ReactNode;
    showPagination?: boolean;
    extraFilter?: ReactNode;
    tableActions?: ReactNode;
    noOptionsText?: ReactNode;
    filterSelectAll?: (data: any) => boolean;
    checkBoxProps?: | ((row, type: 'all' | 'row') => Partial<CheckboxProps>) | Partial<CheckboxProps>;
    onSetFilterValues?: (event: any) => void;
    isShowSearchFilter?: boolean;
    filters?: any;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: 70,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 1, 2, 3),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2, 2, 2, 2),
    },
}));

const SearchInput = styled(OutlinedInput)(({ theme }) => ({
    width: 320,
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: 16,
    },
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '& .MuiOutlinedInput-input': {
        padding: 12,
    },
    '& fieldset': {
        borderWidth: '1px !important',
        borderColor: `${theme.palette.divider} !important`,
    },
}));

export const DataTable = forwardRef<DataTableHandle, DataTableProps>(({
    columns,
    isLoading,
    data,
    idKey = 'id',
    defaultOrder = 'asc',
    defaultOrderBy,
    onSelect,
    onSortChange,
    onPageChange,
    onLimitChange,
    onChange,
    onSelectionChange,
    handleDataLoad,
    handleDataLoadFilters,
    onRowClick,
    limit = 50,
    totalRow = 0,
    renderBulkAction,
    initialLoading,
    selectable,
    collapsible,
    renderDetailRow,
    hasFilter = false,
    hideSearch,
    cardProps,
    size = 'medium',
    detailRowTitle,
    topAction,
    extraFilter,
    showPagination = true,
    noOptionsText,
    filterSelectAll,
    checkBoxProps,
    tableActions,
    filters,
    isShowSearchFilter = true,
    onSetFilterValues,
    ...props
}, ref) => {
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const searchText = useDebounce(search.trim(), 500);
    const [rowsPerPage, setRowsPerPage] = useState(limit);
    const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy as any);
    const [openedRows, setOpenedRows] = useState<any>({});

    useImperativeHandle(ref, () => ({
        search: (text = '') => {
            setSearch(text);
        },
        refresh: (reset) => {
            if (reset) {
                resetFilter();
            }
            applyFilters();
        },
        clearSelection: () => {
            setSelected([]);
            if (onSelectionChange) {
                onSelectionChange([]);
            }
        },
    }));

    const handleRowClick = useCallback(
        (row: any) => () => {
            const { id } = row;
            if (onRowClick) {
                onRowClick(row);
            }
            if (selectable && !onRowClick) {
                const selectedIndex = selected.indexOf(id);
                const newSelected = [...selected];
                if (selectedIndex >= 0) {
                    newSelected.splice(selectedIndex, 1);
                } else {
                    newSelected.push(id);
                }
                setSelected(newSelected);
                if (onSelect) {
                    onSelect(newSelected);
                }
                if (onSelectionChange) {
                    onSelectionChange(newSelected);
                }
            }
        },
        [
            onRowClick,
            onSelect,
            selectable,
            selected,
            onSelectionChange,
        ],
    );

    const handleCheckUncheck = useCallback(
        (row: any) => (e: any) => {
            e.stopPropagation();
            const { id } = row;

            const selectedIndex = selected.indexOf(id);
            const newSelected = [...selected];
            if (selectedIndex >= 0) {
                newSelected.splice(selectedIndex, 1);
            } else {
                newSelected.push(id);
            }
            setSelected(newSelected);
            if (onSelectionChange) {
                onSelectionChange(newSelected);
            }
            if (onSelect) {
                onSelect(newSelected);
            }
        },
        [
            onSelect,
            selected,
            onSelectionChange,
        ],
    );

    const toggleOpenRow = useCallback(
        (id: any, open: any) => (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenedRows((state: any) => {
                return {
                    ...state,
                    [id]: open,
                };
            });
        },
        [],
    );

    const selectableData = useMemo(() => {
        if (filterSelectAll) {
            return filter(data, filterSelectAll);
        }
        return data;
    }, [data, filterSelectAll]);

    const handleSelectAll = useCallback(
        (e: any) => {
            const { checked } = e.target;
            if (checked) {
                const selected = selectableData?.map((n) => n[idKey]);
                setSelected(selected || []);
                if (onSelectionChange) {
                    onSelectionChange(selected || []);
                }
                return;
            }
            setSelected([]);
            if (onSelectionChange) {
                onSelectionChange([]);
            }
        },
        [
            idKey,
            selectableData,
            onSelectionChange,
        ],
    );


    const handleSortChange = useCallback(
        (columnName: any) => () => {
            const dir = orderBy === columnName && order === 'asc' ? 'desc' : 'asc';
            setOrder(dir);
            setOrderBy(columnName);
            if (onSortChange) {
                onSortChange({
                    order: dir,
                    orderBy: columnName,
                });
            }
        },
        [
            orderBy,
            order,
            onSortChange,
        ],
    );

    const handleSearchChange = useCallback((event: any) => {
        const value = event.target.value;
        setSearch(value);
    }, []);

    const handlePageChange = useCallback(
        (_event: any, value: any) => {
            if (onPageChange) {
                onPageChange(value);
            }
            setPage(value);
        },
        [onPageChange],
    );

    const handleChangeRowsPerPage = useCallback(
        (event: any) => {
            if (onLimitChange) {
                onLimitChange(event.target.value);
            }
            setRowsPerPage(event.target.value);
            if (onPageChange) {
                onPageChange(0);
            }
            setPage(0);
        },
        [onLimitChange, onPageChange],
    );

    const resetFilter = useCallback(() => {
        setPage(0);
        setSearch('');
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearch('');
    }, []);

    const applyFilters = debounce(
        useCallback(async () => {
            const searchableColumns: any = chain(columns)
                .filter((column) => !!column.isSearchable)
                .value();

            const request = {
                skip: page * rowsPerPage,
                take: rowsPerPage,
                orderBy: orderBy,
                order: order,
                search: searchText,
                searchIn: searchableColumns,
            };

            let queryBuilder = new QueryBuilder();
            if (request.search && request.searchIn.length > 0) {
                request.searchIn.forEach((item) => {
                    queryBuilder.where((qb) => {
                        qb.orWhere({
                            [item.name]: {
                                $iLike: `%${request.search}%`,
                            },
                        });
                    });
                });
            }

            if (request.orderBy) {
                queryBuilder.addOrder(request.orderBy, `${upperCase(request.order)}` as any);
            }
            queryBuilder.setSkip(request.skip);
            queryBuilder.setTake(request.take);
            if (handleDataLoadFilters) {
                queryBuilder = await handleDataLoadFilters(queryBuilder, request);
            }
            if (handleDataLoad) {
                handleDataLoad(queryBuilder, request);
            }
        }, [
            searchText,
            columns,
            page,
            rowsPerPage,
            orderBy,
            order,
            handleDataLoadFilters,
            handleDataLoad,
        ]),
        500,
    );

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        page,
        rowsPerPage,
        orderBy,
        order,
        searchText,
    ]);

    useEffect(() => {
        if (initialLoading) {
            applyFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLoading]);

    const colSpan = columns.filter(({ isHidden }) => !isHidden).length +
        (selectable ? 1 : 0) +
        (collapsible ? 1 : 0);

    return (
        <Box
            className="data-table"
            width="100%"
            {...props}
        >
            {detailRowTitle ? (
                <>
                    {/* <Stack
                        spacing={1}
                        direction={{
                            xs: 'column',
                            sm: 'row',
                        }}
                        justifyContent="space-between"
                        alignItems="center"
                    > */}
                    <CardHeader
                        sx={{
                            paddingX: { xs: 3 },
                            paddingY: { xs: 2 },
                            whiteSpace: 'nowrap',
                            borderBottom: 'none',
                        }}
                        title={detailRowTitle}
                        action={(topAction || null)}
                    />
                    {/* </Stack> */}
                    <Divider />
                </>
            ) : null}
            {hasFilter ? (
                <StyledToolbar>
                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row',
                        }}
                        spacing={2}
                        justifyContent="space-between"
                        width="100%"
                        alignItems={{
                            xs: 'flex-end',
                            sm: 'center',
                        }}
                    >
                        {hideSearch ? <Box /> : (
                            <SearchInput
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                size="small"
                                type="search"
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <Icon icon={IconEnum.Search} />
                                    </InputAdornment>
                                )}
                            />
                        )}
                        <Stack
                            spacing={2}
                            direction="row"
                            justifyContent={{
                                xs: 'space-between',
                                sm: 'end',
                            }}
                            alignItems="center"
                        >
                            {extraFilter}
                        </Stack>
                    </Stack>
                </StyledToolbar>
            ) : null}

            {(filters && Object?.keys(filters)?.length > 0) || (isShowSearchFilter && searchText) ? (
                <StyledToolbar sx={{ pt: 0 }}>
                    <DataTableFilters
                        filters={{
                            ...filters,
                            ...(searchText && isShowSearchFilter ? { search: searchText } : {}),
                        }}
                        setFilterValues={onSetFilterValues}
                        onClearSearch={handleClearSearch}
                    />
                </StyledToolbar>
            ) : null}

            {selected?.length > 0 && (
                <>
                    <Divider />
                    <StyledToolbar
                        sx={{
                            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.2),
                            color: (theme) => theme.palette.success.main,
                        }}
                    >
                        <Typography
                            component="div"
                            variant="subtitle1"
                        >
                            {selected.length}
                            {' '}
                            rows selected
                        </Typography>
                        {selected.length > 0 &&
                            renderBulkAction ? renderBulkAction(selected) : null}
                    </StyledToolbar>
                </>
            )}

            <TableContainer>
                <Table size={size}>
                    <TableHead>
                        <TableRow>
                            {collapsible ? <TableCell padding="checkbox" /> : null}
                            {selectable ? (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selected.length > 0 &&
                                            selected.length <
                                            (selectableData?.length || 0)
                                        }
                                        checked={
                                            (selectableData?.length || 0) > 0 &&
                                            selected.length === selectableData?.length
                                        }
                                        onChange={handleSelectAll}
                                        {...(typeof checkBoxProps ===
                                            'function'
                                            ? checkBoxProps(null, 'all')
                                            : checkBoxProps)}
                                    />
                                </TableCell>
                            ) : null}
                            {columns
                                .filter(({ isHidden }) => !isHidden)
                                .map((column: any, _index) => {
                                    const sortDirection = orderBy === column.name ?
                                        order :
                                        false;
                                    return (
                                        <TableCell
                                            key={'column-' + column.name}
                                            sx={{ whiteSpace: 'nowrap' }}
                                            {...column.props}
                                            sortDirection={sortDirection}
                                        >
                                            {column.isSortable ? (
                                                <TableSortLabel
                                                    hideSortIcon
                                                    active={orderBy === column.name}
                                                    direction={orderBy === column.name ? order : 'asc'}
                                                    onClick={handleSortChange(column.name)}
                                                >
                                                    {column.label}
                                                    {orderBy === column[idKey] ? (
                                                        <Box
                                                            sx={{
                                                                ...visuallyHidden,
                                                            }}
                                                        >
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </Box>
                                                    ) : null}
                                                </TableSortLabel>
                                            ) : (
                                                column.label
                                            )}
                                        </TableCell>
                                    );
                                })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(!data || isLoading) ? Array.from({ length: 5 }).map((_, inx) => (
                            <TableRow
                                hover={selectable || !!onRowClick}

                                key={`column-skeleton-${inx}`}
                                tabIndex={-1}
                                role="checkbox"
                            >
                                {collapsible ? (
                                    <TableCell padding="checkbox">
                                        <Skeleton />
                                    </TableCell>
                                ) : null}
                                {selectable ? (
                                    <TableCell padding="checkbox">
                                        <Skeleton />
                                    </TableCell>
                                ) : null}

                                {columns
                                    .filter(({ isHidden }) => !isHidden)
                                    .map((column, _index) => (
                                        <TableCell
                                            key={'cell-' + column.name}
                                            {...column.props}
                                        >
                                            {column.skeletonRender ? (
                                                column.skeletonRender()
                                            ) : (
                                                <Skeleton width="90%" />
                                            )}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        )) : null}
                        {data?.map((row: any, index) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            const open = openedRows[row.id];
                            return (
                                <Fragment key={row.id || 'row-' + index}>
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                        onClick={handleRowClick(row)}
                                        sx={
                                            onRowClick ?
                                                { cursor: 'pointer' } :
                                                {}
                                        }
                                    >
                                        {collapsible ? (
                                            <TableCell
                                                onClick={(e) => e.stopPropagation()
                                                }
                                                padding="checkbox"
                                            >
                                                {typeof collapsible === 'function' ?
                                                    (collapsible(row) && (
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={toggleOpenRow(row.id, !open)}
                                                        >
                                                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        </IconButton>
                                                    )) : (
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={toggleOpenRow(row.id, !open)}
                                                        >
                                                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        </IconButton>
                                                    )
                                                }
                                                {/* <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={toggleOpenRow(
                                                        row.id,
                                                        !open,
                                                    )}
                                                >
                                                    {open ? (
                                                        <KeyboardArrowUp />
                                                    ) : (
                                                        <KeyboardArrowDown />
                                                    )}
                                                </IconButton> */}
                                            </TableCell>
                                        ) : null}
                                        {selectable ? (
                                            <TableCell
                                                padding="checkbox"
                                                onClick={(e) => e.stopPropagation()
                                                }
                                            >
                                                <Checkbox
                                                    onClick={handleCheckUncheck(
                                                        row,
                                                    )}
                                                    checked={
                                                        isItemSelected
                                                    }
                                                    {...(typeof checkBoxProps === 'function' ? checkBoxProps(row, 'row') : checkBoxProps)}
                                                />
                                            </TableCell>
                                        ) : null}
                                        {columns
                                            .filter(({ isHidden }) => !isHidden)
                                            .map((column, _index) => (
                                                <TableCell
                                                    key={'cell-two' + column.name}
                                                    {...column.props}
                                                >
                                                    {column.render ?
                                                        column.render(row) :
                                                        get(
                                                            row,
                                                            column.name,
                                                        ) ||
                                                        column.defaultValue}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                    {renderDetailRow && collapsible ? (
                                        <TableRow
                                            sx={{
                                                '&:nth-of-type(even)': {
                                                    backgroundColor:
                                                        'transparent',
                                                },
                                            }}
                                        >
                                            <TableCell
                                                style={{
                                                    paddingBottom: 0,
                                                    paddingTop: 0,
                                                }}
                                                colSpan={colSpan}
                                            >
                                                <Collapse
                                                    in={open}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    {renderDetailRow(
                                                        row,
                                                    )}
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    ) : null}
                                </Fragment>
                            );
                        })}
                    </TableBody>
                    {data?.length === 0 && (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    colSpan={colSpan}
                                >
                                    {noOptionsText ? (
                                        <Typography
                                            gutterBottom
                                            align="center"
                                            variant="subtitle1"
                                            py={3}
                                        >
                                            {noOptionsText}
                                        </Typography>
                                    ) : (
                                        <Box sx={{ py: 3 }}>
                                            <Typography
                                                gutterBottom
                                                align="center"
                                                variant="subtitle1"
                                            >
                                                No results found
                                            </Typography>
                                            {search ? (
                                                <Typography
                                                    variant="body2"
                                                    align="center"
                                                >
                                                    No results found for
                                                    &nbsp;
                                                    <strong>
                                                        &quot;
                                                        {search}
                                                        &quot;
                                                    </strong>
                                                    . Try checking for typos
                                                    or using complete words.
                                                </Typography>
                                            ) : null}
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            {/* </Scrollbar> */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pl={3}
            >
                {tableActions}
                {showPagination && totalRow > 0 ? (
                    <TablePagination
                        rowsPerPageOptions={[
                            50,
                            100,
                            200,
                        ]}
                        component="div"
                        count={totalRow}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Page"
                        showFirstButton
                        showLastButton
                    // slotProps={{
                    //     actions: {
                    //         firstButtonIcon: <Icon icon={IconEnum.LINE_ARROW_LEFT} />,
                    //     },
                    // }}
                    />
                ) : null}
            </Stack>
        </Box>
    );
});
