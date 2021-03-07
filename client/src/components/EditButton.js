import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

// import MyPopup from '../utils/MyPopup';

const EditButton = ({ postId, commentId, postBody, commentBody }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      closeIcon
      open={open}
      trigger={
        <Button as="div" color="blue" floated="right">
          <Icon name="edit" style={{ margin: 0 }} />
        </Button>
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header
        icon="archive"
        content={commentId ? "Edit comment" : "Edit post"}
      />
      <Modal.Content>
        {commentId ? <p>{commentBody}</p> : <p>{postBody}</p>}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button color="green" onClick={() => setOpen(false)}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditButton;
