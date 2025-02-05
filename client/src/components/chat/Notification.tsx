import { Snackbar, Button, SnackbarContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const Notification = ({ open, message, onClose, onClick }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000} 
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <SnackbarContent
        message={message}
        action={
          <>
          <Button color="primary" size="small" onClick={onClick}>
            Go to Chat
          </Button>
          <IconButton color="inherit" size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          </>
        }
      />
    </Snackbar>
  );
};

export default Notification;

