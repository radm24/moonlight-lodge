import styled from "styled-components";
import { HiSquare2Stack, HiPencil, HiTrash } from "react-icons/hi2";

import { useDuplicateCabin } from "./useDuplicateCabin";
import { useDeleteCabin } from "./useDeleteCabin";
import { formatCurrency } from "../../utils/helpers";

import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({
  cabin: { max_capacity: maxCapacity, regular_price: regularPrice, ...fields },
}) {
  const cabin = { ...fields, maxCapacity, regularPrice };
  const { id: cabinId, name, image, discount } = cabin;

  const { isDuplicating, duplicateCabin } = useDuplicateCabin();
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const isPending = isDuplicating || isDeleting;

  return (
    <Table.Row>
      <Img src={image} alt="Cabin" />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />

            <Menus.List id={cabinId}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                disabled={isPending}
                onClick={() => duplicateCabin(cabinId)}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open opens="cabin-edit">
                <Menus.Button icon={<HiPencil />} disabled={isPending}>
                  Edit
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="cabin-delete">
                <Menus.Button icon={<HiTrash />} disabled={isPending}>
                  Delete
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="cabin-edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          <Modal.Window name="cabin-delete">
            <ConfirmDelete
              resourceName="cabin"
              disabled={isPending}
              onConfirm={() => deleteCabin(cabinId)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
