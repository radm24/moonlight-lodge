import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";
import Button from "../../ui/Button";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="cabin-add">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-add">
        <CreateCabinForm />
      </Modal.Window>
    </Modal>

    /* Not compound Modal
    <>
      <div>
        <Button onClick={() => setShowModal(true)}>Add new cabin</Button>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CreateCabinForm onCloseModal={() => setShowModal(false)} />
        </Modal>
      )}
    </>
    */
  );
}

export default AddCabin;
