import { Box } from "@mui/material";
import TutorSignup from "../../components/tutor/TutorSignup";
import Navbar from "../../components/shared/Navbar";
import { useState } from "react";

const TutorSignupPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <Box>
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <TutorSignup />
    </Box>
  );
};

export default TutorSignupPage;
