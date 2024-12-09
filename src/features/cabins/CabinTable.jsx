import { useSearchParams } from "react-router-dom";

import { useCabins } from "./useCabins";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CabinRow from "./CabinRow";
import Menus from "../../ui/Menus";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (cabins.length === 0) return <Empty resource="cabins" />;

  // 1. Filter
  const filterValue = searchParams.get("discount") || "all";
  const filteredCabins = cabins.filter(({ discount }) =>
    filterValue === "no-discount"
      ? discount === 0
      : filterValue === "with-discount"
        ? discount > 0
        : true
  );

  // 2. Sort
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, order] = sortBy.split("-");
  const modifier = order === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.sort(
    (a, b) =>
      (typeof a[field] === "string"
        ? a[field].localeCompare(b[field])
        : a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        ></Table.Body>
      </Table>
    </Menus>
  );
}

export default CabinTable;
