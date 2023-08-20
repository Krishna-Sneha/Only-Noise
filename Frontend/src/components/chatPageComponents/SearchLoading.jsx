import React from "react";
import { Stack, Skeleton } from "@mui/material";

export function SearchLoading() {
  return (
    <>
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
        <Skeleton variant="rounded" height={50} />
      </Stack>
    </>
  );
}
