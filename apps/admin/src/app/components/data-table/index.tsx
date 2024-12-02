import { useTheme } from '@mui/material/styles';
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
    Card,
    alpha,
} from '@mui/material';
import {
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { visuallyHidden } from '@mui/utils';
import { chain, debounce, get, map, upperCase } from 'lodash';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useDebounce } from '@libs/react-core';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

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

export interface DataTableProps extends Omit<BoxProps, 'onChange' | 'onSelect'> {
  columns: DataTableColumn<any>[];
  data: any[] | null;
  defaultOrder?: 'asc' | 'desc';
  defaultOrderBy?: string;
  idKey?: string;
  limit?: number;
  totalRow?: number;
  initialLoading?: boolean;
  selectable?: boolean;
  collapsible?: boolean;
  hasFilter?: boolean;
  renderBulkAction?: (selectedIds: string[]) => JSX.Element;
  onSortChange?: (event: { order: string; orderBy: 'asc' | 'desc' }) => void;
  onPageChange?: (pageNumber: number) => void;
  onLimitChange?: (limit: number) => void;
  onSelect?: (event: string[]) => void;
  onChange?: (event: DataTableChangeEvent) => void;
  onRowClick?: (event: any) => void;
  onFilterBy?: (event: any) => void;
  renderDetailRow?: (row: any) => ReactNode;
  detailRowTitle?: string | ReactNode;
  cardProps?: BoxProps;
  size?: 'small' | 'medium';
  topAction?: ReactNode;
  showPagination?: boolean;
  extraFilter?: ReactNode;
  noOptionsText?: ReactNode;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: 70,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 1, 2, 3),
}));

const SearchInput = styled(OutlinedInput)(({ theme }) => ({
    width: 320,
    [theme.breakpoints.down('md')]: {
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
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.divider} !important`,
    },
}));

const DataTable = forwardRef<DataTableHandle, DataTableProps>(
    (
        {
            columns,
            data,
            idKey = 'id',
            defaultOrder = 'asc',
            defaultOrderBy,
            onSelect,
            onSortChange,
            onPageChange,
            onLimitChange,
            onChange,
            onRowClick,
            limit = 10,
            totalRow = 0,
            renderBulkAction,
            initialLoading,
            selectable,
            collapsible,
            hasFilter = false,
            cardProps,
            size = 'medium',
            detailRowTitle,
            topAction,
            extraFilter,
            showPagination = true,
            noOptionsText,
            ...props
        },
        ref
    ) => {
        const [page, setPage] = useState(0);
        const [selected, setSelected] = useState<string[]>([]);
        const [search, setSearch] = useState('');
        const searchText = useDebounce(search, 500);
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
            },
        }));

        const handleRowClick = useCallback(
            (row: any) => () => {
                const { id } = row;
                onRowClick && onRowClick(row);
                if (selectable && !onRowClick) {
                    const selectedIndex = selected.indexOf(id);
                    const newSelected = [...selected];
                    if (selectedIndex >= 0) {
                        newSelected.splice(selectedIndex, 1);
                    } else {
                        newSelected.push(id);
                    }
                    setSelected(newSelected);
                    onSelect && onSelect(newSelected);
                }
            },
            [onRowClick, onSelect, selectable, selected]
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
                onSelect && onSelect(newSelected);
            },
            [onSelect, selected]
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
            []
        );

        const handleSelectAll = useCallback(
            (e: any) => {
                const { checked } = e.target;
                if (checked) {
                    const selected = data?.map((n) => n[idKey]);
                    setSelected(selected || []);
                    return;
                }
                setSelected([]);
            },
            [idKey, data]
        );

        const handleSortChange = useCallback(
            (columnName: any) => () => {
                const dir = orderBy === columnName && order === 'asc' ? 'desc' : 'asc';
                setOrder(dir);
                setOrderBy(columnName);
                onSortChange &&
          onSortChange({
              order: dir,
              orderBy: columnName,
          });
            },
            [orderBy, order, onSortChange]
        );

        const handleSearchChange = useCallback((event: any) => {
            const value = event.target.value;
            setSearch(value);
        }, []);

        const handlePageChange = useCallback(
            (event: any, value: any) => {
                onPageChange && onPageChange(value);
                setPage(value);
            },
            [onPageChange]
        );

        const handleChangeRowsPerPage = useCallback(
            (event: any) => {
                onLimitChange && onLimitChange(event.target.value);
                setRowsPerPage(event.target.value);
                onPageChange && onPageChange(0);
                setPage(0);
            },
            [onLimitChange, onPageChange]
        );

        const resetFilter = useCallback(() => {
            setPage(0);
            setSearch('');
        }, []);

        const applyFilters = debounce(
            useCallback(() => {
                let filter: any;
                const searchableColumns: any = chain(columns)
                    .filter((column) => !!column.isSearchable)
                    .value();

                if (searchText && searchableColumns.length > 0) {
                    filter = {
                        where: {
                            $or: map(searchableColumns, (item) => {
                                return {
                                    [item.name]: { $iLike: `%${searchText}%` },
                                };
                            }),
                        },
                    };
                }

                let orderInput = {};
                if (orderBy) {
                    orderInput = {
                        order: { [orderBy]: `${upperCase(order)}` },
                    };
                }

                const request = {
                    skip: page * rowsPerPage,
                    take: rowsPerPage,
                    ...orderInput,
                    ...(filter ? filter : {}),
                };
                onChange && onChange(request);
            }, [searchText, columns, page, rowsPerPage, orderBy, order, onChange]),
            500
        );

        useEffect(() => {
            applyFilters();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [page, rowsPerPage, orderBy, order, searchText]);

        useEffect(() => {
            if (initialLoading) {
                applyFilters();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const colSpan =
      columns.filter(({ isHidden }) => !isHidden).length +
      (selectable ? 1 : 0) +
      (collapsible ? 1 : 0);

        return (
            <Box className="data-table" width="100%" {...props}>
                {detailRowTitle && (
                    <>
                        <Stack
                            spacing={1}
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {detailRowTitle && (
                                <CardHeader
                                    sx={{
                                        paddingX: 3,
                                        paddingY: 2,
                                        whiteSpace: 'nowrap',
                                        borderBottom: 'none',
                                    }}
                                    title={detailRowTitle}
                                />
                            )}

                            {topAction && topAction}
                        </Stack>
                        <Divider />
                    </>
                )}
                {hasFilter && (
                    <StyledToolbar>
                        <Stack
                            direction={{ xs: 'column', sm: "row" }}
                            spacing={2}
                            justifyContent="space-between"
                            width="100%"
                        >
                            <SearchInput
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                size="small"
                                type="search"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                }
                            />
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="end"
                            >
                                {extraFilter}
                            </Stack>
                        </Stack>
                    </StyledToolbar>
                )}
                {selected?.length > 0 && (
                    <>
                        <Divider />
                        <StyledToolbar sx={{
                            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.2),
                            color: (theme) => theme.palette.success.main,
                        }}>
                            <Typography component="div" variant="subtitle1">
                                {selected.length} rows selected
                            </Typography>
                            {selected.length > 0 &&
                renderBulkAction &&
                renderBulkAction(selected)}
                        </StyledToolbar>
                    </>
                )}
                {/* <Scrollbar> */}
                <TableContainer>
                    <Table size={size}>
                        <TableHead>
                            <TableRow>
                                {collapsible && <TableCell padding="checkbox"></TableCell>}
                                {selectable && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selected.length > 0 && selected.length < (data?.length || 0)
                                            }
                                            checked={
                                                (data?.length || 0) > 0 && selected.length === data?.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                )}
                                {columns
                                    .filter(({ isHidden }) => !isHidden)
                                    .map((column: any, index) => {
                                        const sortDirection =
                      orderBy === column.name ? order : false;
                                        return (
                                            <TableCell
                                                key={'column-' + index}
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
                                                            <Box sx={{ ...visuallyHidden }}>
                                                                {order === 'desc'
                                                                    ? 'sorted descending'
                                                                    : 'sorted ascending'}
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
                            {!data &&
                [1, 2, 3, 4, 5].map((index) => (
                    <TableRow
                        hover={selectable || !!onRowClick}
                        key={'column-skl' + index}
                        tabIndex={-1}
                        role="checkbox"
                    >
                        {collapsible && (
                            <TableCell padding="checkbox">
                                <Skeleton />
                            </TableCell>
                        )}
                        {selectable && (
                            <TableCell padding="checkbox">
                                <Skeleton />
                            </TableCell>
                        )}

                        {columns
                            .filter(({ isHidden }) => !isHidden)
                            .map((column, index) => (
                                <TableCell key={'cell-' + index} {...column.props}>
                                    {column.skeletonRender ? (
                                        column.skeletonRender()
                                    ) : (
                                        <Skeleton width="90%" />
                                    )}
                                </TableCell>
                            ))}
                    </TableRow>
                ))}
                            {data?.map((row: any, index) => {
                                const isItemSelected = selected.indexOf(row.id) !== -1;
                                const open = openedRows[row.id];
                                return (
                                    <TableRow
                                        hover
                                        key={row.id || 'row-' + index}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                        onClick={handleRowClick(row)}
                                        sx={onRowClick ? { cursor: 'pointer' } : {}}
                                    >
                                        {collapsible && (
                                            <TableCell
                                                onClick={(e) => e.stopPropagation()}
                                                padding="checkbox"
                                            >
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={toggleOpenRow(row.id, !open)}
                                                >
                                                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                        )}
                                        {selectable && (
                                            <TableCell
                                                padding="checkbox"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Checkbox
                                                    onClick={handleCheckUncheck(row)}
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                        )}
                                        {columns
                                            .filter(({ isHidden }) => !isHidden)
                                            .map((column, index) => (
                                                <TableCell key={'cell-two' + index} {...column.props}>
                                                    {column.render
                                                        ? column.render(row)
                                                        : get(row, column.name) || column.defaultValue}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        {data?.length === 0 && (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={colSpan}>
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
                                                {search && (
                                                    <Typography variant="body2" align="center">
                            No results found for &nbsp;
                                                        <strong>&quot;{search}&quot;</strong>. Try checking
                            for typos or using complete words.
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                {/* </Scrollbar> */}

                {(showPagination && totalRow > 0) && (
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        component="div"
                        count={totalRow}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                        labelRowsPerPage="Page"
                    />
                )}
            </Box>
        );
    }
);

export default DataTable;
