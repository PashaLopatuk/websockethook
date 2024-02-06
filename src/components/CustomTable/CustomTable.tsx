'use client';

import { Link, Table, Chip, Typography, Box, Stack, Card } from '@mui/joy';
import { parseObj } from '../../utils/helperFunctions';
import React from 'react';
// import { ISchema, } from '@/utils/models';
// import { usePathname } from 'next/navigation'
// import { Arrow } from '../Icons/Icons';

export interface ISchema {
    [key: string]: {
      dataField: string;

      // customCell?: FC<{ data: any; props?: any } | string> | ((data: string) => JSX.Element);
      customCell?: any
      customCellProps?: object;
      headerCustomCell?: React.FC<any> | JSX.Element

      href?: string;
      columnClassName?: React.CSSProperties;
      // cardArea?: cardAreas;
      cardOnlyCustomCell?: React.FC<any>;
      relativeHref?: string;
      externalHref?: string
    };
  }


function replaceWithObjectValues(inputString: string, replacementObject: any) {
    const replacedString = inputString.replace(/{([^}]+)}/g, (match, key) => {
        return parseObj(key, replacementObject);
    });
    return replacedString;
}

interface ICustomTable {
    title: string | React.ReactNode;

    columns: ISchema;
    data: any;
    vertical?: boolean;
    cardView?: boolean;
    children?: React.ReactNode;
    customButton?: React.ReactNode;
    customButtons?: React.ReactNode[];
    TFoot?: React.ReactNode;

    rowOnClick?: (params: any) => void

    Sorting?: {
        selectedSortParam: string | undefined,
        setSelectedSortParam: React.Dispatch<React.SetStateAction<string | undefined>>,
        sortDirection: -1 | 1,
        setSortDirection: React.Dispatch<React.SetStateAction<-1 | 1>>,
    }
    // setSelectedSortParam?: (e: any) => void
    // selectedSortParam?: string
    // setSortDirection?: (e: -1 | 1) => void
    // sortDirection?: -1 | 1
}

const CustomTable: React.FC<ICustomTable> = ({
                                                 title,
                                                 columns,
                                                 data,
                                                 vertical = false,
                                                 cardView = false,
                                                 children,
                                                 customButton,
                                                 customButtons,
                                                 TFoot,
                                                 Sorting,
                                                 rowOnClick = () => { },
                                                 // setSelectedSortParam,
                                                 // selectedSortParam,
                                                 // setSortDirection,
                                                 // sortDirection,
                                                 ...props
                                             }) => {
    const pathname = window.location.href //usePathname()
    // console.log('Table Render!!!')
    const arrColumns: any[] = [];
    for (let column in columns) {
        arrColumns.push({ ...columns[column], name: column });
    }

    if (vertical) {
        return (
            <>
                {title && (
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        {typeof title === 'string' ? (
                            <Typography padding={'10px'} level="h3">
                                {title}
                            </Typography>
                        ) : (
                            <>{title}</>
                        )}

                        <Stack
                            direction={'row'}
                            // justifyContent={'space-between'}
                            alignItems={'center'}
                            spacing={1}
                        >
                            {customButtons?.map((button) => (
                                <>{button}</>
                            ))}
                        </Stack>
                    </Stack>
                )}
                {children}
                <Table {...props}
                       hoverRow
                       sx={{
                           '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',

                       }}
                >
                    <tbody>
                    {data &&
                        arrColumns?.map((row) => {
                            const cellData = parseObj(row.dataField, data[0]);
                            const cell = row.customCell
                                ? row.customCellProps
                                    ? row.customCell(cellData, row.customCellProps)
                                    : row.customCell(cellData)
                                : cellData;
                            return (
                                <tr key={row.name} style={{ borderBottom: "none" }}>
                                    <td>{row.name}</td>
                                    <td>
                                        {row.href ? (
                                            <React.Fragment key={row.name}>
                                                <Link
                                                    // sx={{
                                                    //   textOverflow: 'ellipsis',
                                                    //   whiteSpace: 'nowrap',
                                                    //   overflow: 'hidden',
                                                    // }}
                                                    href={replaceWithObjectValues(row.href, data[0])}
                                                >
                                                    {cell}
                                                </Link>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment key={row.name}>{cell}</React.Fragment>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </>
        );
    }
    return (
        <>
            {title && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {typeof title === 'string' ? (
                        <Typography padding={'10px'} level="h3">
                            {title}
                        </Typography>
                    ) : (
                        <>{title}</>
                    )}
                    {customButton}
                </Box>
            )}
            {children}
            <Box
                sx={{
                    display: { xs: cardView ? 'none' : 'block', sm: 'block' },
                    zIndex: '50',
                    background: 'none',
                    // overflow: 'auto',

                    borderRadius: '0.4rem',
                    border: '1px solid rgba(0,0,0, 0.1)'
                }}
            >
                <Table
                    {...props}
                    hoverRow
                    stickyHeader
                    stickyFooter={!!TFoot}
                    size={'sm'}
                    // colSpan={Object.keys(columns).length}
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        // '--TableCell-paddingY': '4px',
                        // '--TableCell-paddingX': '8px',
                    }}>
                    <thead>
                    <tr>
                        {data &&
                            arrColumns?.map((column) => {
                                return (
                                    <th
                                        style={{
                                            verticalAlign: 'middle',
                                            ...column?.columnClassName,
                                        }}
                                        key={column.name}
                                    >

                                        {
                                            column.headerCustomCell ?
                                                typeof column.headerCustomCell === 'function' ?
                                                    column.headerCustomCell(column.dataField)
                                                    :
                                                    column.headerCustomCell
                                                :
                                                Sorting ?

                                                    <Link
                                                        color={Sorting.selectedSortParam === column.dataField ? 'primary' : 'neutral'}
                                                        underline="none"
                                                        sx={{
                                                            verticalAlign: 'baseline',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: '0.2s',
                                                            '& svg': {
                                                                transition: '0.2s',
                                                                transform: Sorting.sortDirection + 1 ? 'rotate(0deg)' : 'rotate(180deg)',
                                                            },
                                                            '&:hover': {
                                                                '& svg': { opacity: 1 },
                                                            },
                                                            textDecorationColor: 'rgba(var(--foreground-rgb), 0.5)',
                                                        }}

                                                        onClick={() => {
                                                            if (Sorting.selectedSortParam !== column.dataField) {
                                                                // console.log(column)
                                                                Sorting.setSelectedSortParam(column.dataField)
                                                                Sorting.setSortDirection(1)
                                                            } else if (Sorting.sortDirection === 1) {
                                                                Sorting.setSortDirection(-1)
                                                            } else if (Sorting.sortDirection === -1) {
                                                                Sorting.setSelectedSortParam('')
                                                                Sorting.setSortDirection(1)
                                                            }
                                                        }}
                                                        endDecorator={
                                                            (Sorting.selectedSortParam === column.dataField) ? (
                                                                // <Arrow
                                                                //     // color={'primary'}
                                                                //     style={{
                                                                //         // color: 'rgba(var(--foreground-rgb))',
                                                                //         color: 'inherit',
                                                                //         width: '1rem',
                                                                //         height: '1rem',
                                                                //         opacity: 1,
                                                                //     }}
                                                                // />
                                                                <></>
                                                            ) : null
                                                        }
                                                    >
                                                        {column.name}
                                                    </Link>

                                                    :

                                                    <Link color={'neutral'} underline='none'>{column.name}</Link>
                                        }

                                    </th>
                                );
                            })}
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item: any) => {
                        return (
                            <tr key={item}>
                                {arrColumns?.map((column) => {
                                    const cellData = column.href ? `${parseObj(column.dataField, item) ?
                                        parseObj(column.dataField, item)
                                        : 'Not set'
                                    }` : parseObj(column.dataField, item);
                                    const cell = column.customCell
                                        ? column.customCellProps
                                            ? column.customCell(cellData, column.customCellProps)
                                            : column.customCell(cellData)
                                        : cellData;

                                    return (
                                        <td
                                            style={{
                                                textOverflow: '',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                zIndex: 40,
                                            }}
                                            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                                const target = event.target as HTMLInputElement;
                                                if (target.type === undefined) {
                                                    rowOnClick(item)
                                                }
                                            }}

                                            key={column.name}
                                        >
                                            {(() => {
                                                if (column.href) {
                                                    return (
                                                        <Link
                                                            sx={{
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                            }}
                                                            href={replaceWithObjectValues(column.href, item)}
                                                        >
                                                            {cell}
                                                        </Link>
                                                    )
                                                }
                                                if (column.relativeHref) {
                                                    return (
                                                        <Link
                                                            sx={{
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                            }}
                                                            href={pathname + replaceWithObjectValues(column.relativeHref, item)}
                                                        >
                                                            {cell}
                                                        </Link>
                                                    )
                                                }
                                                if (column.externalHref) {
                                                    return (
                                                        <Link
                                                            sx={{
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                            }}
                                                            target={'_blank'}
                                                            href={replaceWithObjectValues(column.externalHref, item)}
                                                        >
                                                            {cell}
                                                        </Link>
                                                    )
                                                }
                                                return (
                                                    cell
                                                )
                                            })()}
                                        </td>
                                    );



                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    {
                        TFoot
                    }
                    </tfoot>
                </Table>
            </Box>
            {/* <Box
        sx={{
          display: { xs: cardView ? 'flex' : 'none', sm: 'none' },
          flexDirection: 'column',
          gap: 2,
          margin: [0, 5],
        }}
      >
        {data?.map((item: any) => {
          let CardData: { [key: string]: any } = {};

          // for (let key in cardAreas) {
          //   CardData[key] = React.Fragment;
          // }

          {
            arrColumns?.map((column) => {
              const cellData = parseObj(column.dataField, item)
              const cell = column.cardOnlyCustomCell
                ? column.customCellProps
                  ? column.cardOnlyCustomCell(cellData, column.customCellProps)
                  : column.cardOnlyCustomCell(cellData)
                : column.customCell
                  ? column.customCellProps
                    ? column.customCell(cellData, column.customCellProps)
                    : column.customCell(cellData)
                  : cellData;

              if (column.cardArea) {
                if (column.href) {
                  CardData[column.cardArea] = (
                    <Link
                      sx={{
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      href={replaceWithObjectValues(column.href, item)}
                    >
                      {cell}
                    </Link>
                  );
                } else {
                  CardData[column.cardArea] = cell;
                }
              }
            });
          }
          return (
            <Box width={'100%'} minHeight={150} key={item?.id}>
              <Card variant="soft">
                <Stack direction={'column'} gap={1}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography level="body-sm">
                      {CardData[cardAreas.topLeft]}
                    </Typography>
                    <Typography level="body-sm">
                      {CardData[cardAreas.topRight]}
                    </Typography>
                  </Stack>
                  <Box>
                    <Typography level="h4">
                      {CardData[cardAreas.center]}
                    </Typography>
                    <Stack direction={'row'} gap={2}>
                      <Typography level="body-md">
                        {CardData[cardAreas.firstSubCenter]}
                      </Typography>
                      {CardData[cardAreas.firstSubCenter] !== React.Fragment &&
                        CardData[cardAreas.secondSubCenter] !== React.Fragment
                        ? '|'
                        : null}
                      <Typography level="body-md">
                        {CardData[cardAreas.secondSubCenter]}
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography level="body-sm">
                      {CardData[cardAreas.bottomLeft]}
                    </Typography>
                    <Typography level="body-sm">
                      {CardData[cardAreas.bottomRight]}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Box>
          );
        })}
      </Box> */}
        </>
    );
};

export default CustomTable;
