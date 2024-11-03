import React from "react";
import IdeaGenerator from "../../components/IdeaGenerator";
import ProtectedRoute from "@/components/ProtectedRoute";

const IdeaGeneratorPage = () => {
  return (
    <ProtectedRoute requireBrandVoice>
      <IdeaGenerator />
    </ProtectedRoute>
  );
};

export default IdeaGeneratorPage;
