import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { ITutor } from "../../types/types";


type TutorDetailModalProps = {
  open: boolean;
  onClose: () => void;
  tutor: ITutor | null;
};

const TutorDetailsModal: React.FC<TutorDetailModalProps> = ({
  open,
  onClose,
  tutor,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {xs:350,md:400},
          bgcolor: "#FAFAFA",
          border: "2px solid #000",
          borderRadius: 1,
          padding: 2,
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {tutor ? (
          <div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              <span
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Name{" "}
              </span>
              : {tutor.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <span
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Email{" "}
              </span>
              : {tutor.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <span
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Description{" "}
              </span>
              : {tutor.bio}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              <span
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Certificates{" "}
              </span>
              :
            </Typography>

            {tutor.certificates.map((certificate, index) => (
              <Box key={index} sx={{ marginTop: 2 }}>
                <img
                  src={certificate}
                  alt={`Certificate ${index + 1}`}
                  style={{
                    width: "80%",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
                <a
                  href={certificate}
                  download={`certificate_${index + 1}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    sx={{ marginTop: 1 }}
                  >
                    View Certificate {index + 1}
                  </Button>
                </a>
              </Box>
            ))}
          </div>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default TutorDetailsModal;
