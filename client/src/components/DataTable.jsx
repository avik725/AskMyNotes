import { Grid } from "gridjs-react";
import React from "react";

const DataTable = React.memo(
  ({
    columns,
    url,
    thenFn,
    handleFn,
    totalFn,
    paginationLimit,
    paginationUrlFn,
    isSearchEnabled,
    searchConfig,
    isSortEnabled,
    sortConfig,
  }) => {
    return (
      <Grid
        columns={columns || []}
        server={{
          url: url,
          credentials: "include",
          then: thenFn,
          handle: handleFn,
          total: totalFn,
        }}
        pagination={{
          limit: paginationLimit,
          server: {
            url: paginationUrlFn,
          },
        }}
        search={
          isSearchEnabled
            ? searchConfig
              ? searchConfig
              : isSearchEnabled
            : isSearchEnabled
        }
        sort={
          isSortEnabled
            ? sortConfig
              ? sortConfig
              : isSearchEnabled
            : isSearchEnabled
        }
        // update={{
        //   pagination: ()=>{}
        // }}
      ></Grid>
    );
  }
);


export default DataTable