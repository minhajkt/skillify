import React, { useEffect, useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Phone, PhoneOff, Video, MicOff, Mic, X, VideoOff } from "lucide-react";
import { keyframes } from "@mui/system";
import { VideoCallProps } from "../../types/types";

const pulseAnimation = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

const VideoCall: React.FC<VideoCallProps> = ({
  isVideoCallActive,
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  onStartCall,
  onEndCall,
  onAcceptCall,
  onRejectCall,
  incomingCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [calling, setCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  useEffect(() => {
    if (isVideoCallActive) {
      setCalling(true);
    } else {
      setCalling(false);
      setCallConnected(false);
    }
  }, [isVideoCallActive]);

  useEffect(() => {
    if (remoteStream && remoteStream.getVideoTracks().length > 0) {
      setCalling(false);
      setCallConnected(true);
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const renderCallingState = () => (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="90%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="rgba(0, 0, 0, 0.9)"
    >
      <CircularProgress size={60} sx={{ color: "white", mb: 2 }} />
      <Typography
        variant="h5"
        sx={{
          color: "white",
          mb: 1,
          animation: `${pulseAnimation} 2s infinite`,
        }}
      >
        Calling...
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          mb: 1,
          animation: `${pulseAnimation} 1.5s infinite`,
        }}
      >
        Waiting for answer
      </Typography>
    </Box>
  );

  return (
    <Box position="relative">
      {isVideoCallActive ? (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bgcolor="black"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={50}
        >
          <Box position="relative" width="100%" height="100%">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "90%",
                objectFit: "contain",
                display: "block",
                position: "absolute",
                top: 40,
              }}
            />

            {calling && !callConnected && renderCallingState()}

            <Paper
              elevation={4}
              sx={{
                position: "absolute",

                top: { xs: 20, md: 40 }, 
                right: { xs: 16, md: 16 }, 
                width: { xs: 120, md: 250 },
                height: { xs: 90, md: 150 },
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Paper>

            <Box
              position="absolute"
              bottom={24}
              left="50%"
              sx={{ transform: "translateX(-50%)" }}
              display="flex"
              gap={3}
            >
              <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    backgroundColor: "red.500",
                    color: isMuted ? "red" : "white",
                    padding: 2,
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "red.600",
                    },
                  }}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isVideoOff ? "Turn Video On" : "Turn Video Off"}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    backgroundColor: "blue.500",
                    color: isVideoOff ? "red" : "white",
                    padding: 2,
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "blue.600",
                    },
                  }}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </IconButton>
              </Tooltip>

              <Tooltip title="End Call">
                <IconButton
                  onClick={onEndCall}
                  sx={{
                    backgroundColor: "red.500",
                    color: "red",
                    padding: 2,
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "red.600",
                    },
                  }}
                >
                  <PhoneOff size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      ) : (
        <Tooltip title="Start Video Call">
          <IconButton
            onClick={onStartCall}
            sx={{
              backgroundColor: "blue.500",
              color: "white",
              padding: 2,
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "blue.600",
              },
            }}
          >
            <Video size={25} style={{ color: "#4169E1", fill: "#4169E1" }} />
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={incomingCall} onClose={onRejectCall}>
        <DialogTitle sx={{ textAlign: "center" }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Paper
              sx={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "blue.100",
                borderRadius: "50%",
              }}
            >
              <Video size={32} color="blue" />
            </Paper>
          </Box>
          Incoming Video Call
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center">
            You have an incoming video call.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onAcceptCall}
            startIcon={<Phone />}
            variant="contained"
            color="success"
          >
            Accept
          </Button>
          <Button
            onClick={onRejectCall}
            startIcon={<X />}
            variant="contained"
            color="error"
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoCall;
